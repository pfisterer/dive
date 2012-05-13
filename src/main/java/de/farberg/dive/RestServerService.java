/**
 * Copyright (c) 2012, Dennis Pfisterer, University of Luebeck
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * 	- Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * 	  disclaimer.
 * 	- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 * 	  following disclaimer in the documentation and/or other materials provided with the distribution.
 * 	- Neither the name of the University of Luebeck nor the names of its contributors may be used to endorse or promote
 * 	  products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package de.farberg.dive;

import com.google.common.util.concurrent.AbstractService;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.servlet.GuiceFilter;

import de.farberg.dive.util.InjectLogger;

import org.eclipse.jetty.http.spi.JettyHttpServerProvider;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.slf4j.Logger;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

@Singleton
public class RestServerService extends AbstractService {

	@InjectLogger
	private Logger log;

	private final CommandLineConfig config;

	private final GuiceFilter guiceFilter;

	private Server server;

	@Inject
	public RestServerService(final CommandLineConfig config, final GuiceFilter guiceFilter) {
		this.config = config;
		this.guiceFilter = guiceFilter;
	}

	@Override
	protected void doStart() {

		try {

			server = new Server(config.webServerPort);

			FilterHolder guiceFilterHolder = new FilterHolder(guiceFilter);

			ServletContextHandler guiceContextHandler = new ServletContextHandler();
			guiceContextHandler.setContextPath("/");
			guiceContextHandler.addFilter(guiceFilterHolder, "/*", EnumSet.allOf(DispatcherType.class));
			guiceContextHandler.addServlet(DefaultServlet.class, "/");

			// set up JAX-WS support for Jetty
			System.setProperty(
					"com.sun.net.httpserver.HttpServerProvider",
					JettyHttpServerProvider.class.getCanonicalName()
			);
			JettyHttpServerProvider.setServer(server);

			ContextHandlerCollection contexts = new ContextHandlerCollection();
			contexts.setHandlers(new Handler[]{ guiceContextHandler });

			server.setHandler(contexts);
			server.start();

			log.info("Started server on port {}", config.webServerPort);

			notifyStarted();

		} catch (Exception e) {

			log.error("Failed to start server on port {} due to the following error: " + e, e);
			notifyFailed(e);
		}
	}

	@Override
	protected void doStop() {

		try {
			server.stop();


			notifyStopped();
		} catch (Exception e) {

			notifyFailed(e);
		}
	}
}
