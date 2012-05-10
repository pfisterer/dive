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
