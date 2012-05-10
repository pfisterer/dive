package de.farberg.dive;

import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import org.hibernate.ejb.Ejb3Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Scopes;
import com.google.inject.matcher.Matchers;

import de.farberg.dive.lectures.Evaluation;
import de.farberg.dive.lectures.HibernateModules;
import de.farberg.dive.lectures.Module;
import de.farberg.dive.lectures.Modules;
import de.farberg.dive.util.Log4JTypeListener;

@SuppressWarnings("deprecation")
public class GuiceModule extends AbstractModule {
	private Logger log = LoggerFactory.getLogger(GuiceModule.class);

	private EntityManagerFactory factory = null;

	private final CommandLineConfig config;

	public GuiceModule(final CommandLineConfig config) {
		this.config = config;
	}

	@Override
	protected void configure() {
		bind(CommandLineConfig.class).toInstance(config);
		bind(Modules.class).to(HibernateModules.class).in(Scopes.SINGLETON);
		bindListener(Matchers.any(), new Log4JTypeListener());
		install(new ServletModule());
	}

	/**
	 * @see http://docs.jboss.org/hibernate/core/4.0/hem/en-US/html/options.html
	 */
	@Provides
	synchronized EntityManager provideEntityManager() {
		// Create singleton if it doesn't exist
		if (factory == null) {
			factory = createEntityManagerFactory();
		}

		// Create a new entity manager using the factory
		return factory.createEntityManager();
	}

	private EntityManagerFactory createEntityManagerFactory() {
		Ejb3Configuration cfg = new Ejb3Configuration();

		Properties properties = new Properties();

		properties.put("hibernate.connection.url", "jdbc:hsqldb:" + config.databaseLocation);
		properties.put("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
		properties.put("hibernate.connection.driver_class", "org.hsqldb.jdbcDriver");
		properties.put("hibernate.connection.username", "sa");
		properties.put("hibernate.connection.password", "");

		properties.put("hibernate.c3p0.min_size", 10);
		properties.put("hibernate.c3p0.max_size", 100);
		properties.put("hibernate.c3p0.idle_test_period", 300);
		properties.put("hibernate.c3p0.timeout", 1800);
		properties.put("c3p0.autoCommitOnClose", true);
		properties.put("hibernate.c3p0.autoCommitOnClose", true);

		properties.put("hibernate.show_sql", "false");
		properties.put("hibernate.format_sql", "false");
		properties.put("hibernate.hbm2ddl.auto", "update");

		for (Object key : properties.keySet()) {
			String keyString = (String) key;
			Object value = keyString.contains("password") ? "*****" : properties.get(key);
			log.debug("Using Hibernate property: {} = {}", keyString, value);
		}

		List<Class<? extends Object>> persistedClasses = new LinkedList<>();
		persistedClasses.add(Module.class);
		persistedClasses.add(Evaluation.class);

		for (Class<? extends Object> c : persistedClasses)
			cfg.addAnnotatedClass(c);

		return cfg.addProperties(properties).buildEntityManagerFactory();
	}

}
