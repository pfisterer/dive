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

import java.net.URL;

import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlets.CrossOriginFilter;

import com.google.common.collect.ImmutableMap;
import com.google.inject.Singleton;
import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.guice.JerseyServletModule;
import com.sun.jersey.guice.spi.container.servlet.GuiceContainer;


/**
 * Configuration class to set up Google Guice-based dependency injection with the Jersey JAX-RS implementation. For more
 * information please check
 * http://jersey.java.net/nonav/apidocs/latest/contribs/jersey-guice/com/sun/jersey/guice/spi/container
 * /servlet/package-summary.html.
 */
public class ServletModule extends JerseyServletModule {

	@Override
	protected void configureServlets() {

		bind(RootResource.class);
		bind(DefaultServlet.class).in(Singleton.class);
		bind(CrossOriginFilter.class).in(Singleton.class);

		serve("/rest*").with(GuiceContainer.class, ImmutableMap.of(JSONConfiguration.FEATURE_POJO_MAPPING, "true"));
		
		filter("/*").through(CrossOriginFilter.class,
				ImmutableMap.of("allowedOrigins", "http://*", "allowedMethods", "GET,POST,PUT,DELETE", "allowCredentials", "true"));
		
		URL webAppFolder = this.getClass().getClassLoader().getResource("webapp");
		if(webAppFolder==null)
			throw new RuntimeException("No webapp folder found");
		
		serve("/*").with(DefaultServlet.class,
				ImmutableMap.of("resourceBase", webAppFolder.toExternalForm(), "maxCacheSize", "0"));
	}
}
