package de.farberg.dive;

import java.util.logging.Handler;
import java.util.logging.LogManager;

import org.apache.log4j.Level;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.bridge.SLF4JBridgeHandler;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.uniluebeck.itm.tr.util.Logging;

/**
 * This class must not be modified.
 * <p/>
 * Main class to bootstrap the HTTP server that runs the phone book REST
 * service.
 */
public class Main {

	static {
		Logging.setLoggingDefaults();

		// Jersey uses java.util.logging - bridge to slf4
		java.util.logging.Logger rootLogger = LogManager.getLogManager().getLogger("");
		Handler[] handlers = rootLogger.getHandlers();
		for (int i = 0; i < handlers.length; i++) {
			rootLogger.removeHandler(handlers[i]);
		}
		SLF4JBridgeHandler.install();
	}

	private static Logger log = LoggerFactory.getLogger(Main.class);

	public static void main(String[] args) throws Exception {

		final CommandLineConfig config = parseCmdLineOptions(args);

		setLogLevel(config);

		log.debug("Starting up with the following configuration " + config);

		final Injector injector = Guice.createInjector(new GuiceModule(config));
		final RestServerService serverService = injector.getInstance(RestServerService.class);

		try {
			serverService.start().get();
		} catch (Exception e) {
			log.warn("Exception while starting server: " + e, e);
			System.exit(1);
		}

		Runtime.getRuntime().addShutdownHook(new Thread("ShutdownThread") {
			@Override
			public void run() {
				log.info("Received EXIT signal. Shutting down server...");
				try {
					serverService.stop().get();
				} catch (Exception e) {
					log.warn("Exception caught while shutting server: " + e, e);
				}
			}
		}
		);

	}

	private static void setLogLevel(final CommandLineConfig config) {
		if (config.logLevel != null) {
			org.apache.log4j.Logger.getRootLogger().setLevel(config.logLevel);
		} else if (config.verbose) {
			org.apache.log4j.Logger.getRootLogger().setLevel(Level.DEBUG);
		}
	}

	private static CommandLineConfig parseCmdLineOptions(final String[] args) {

		CommandLineConfig options = new CommandLineConfig();
		CmdLineParser parser = new CmdLineParser(options);

		try {
			parser.parseArgument(args);
			if (options.help) {
				printHelpAndExit(parser);
			}
		} catch (CmdLineException e) {
			System.err.println(e.getMessage());
			printHelpAndExit(parser);
		}

		return options;
	}

	private static void printHelpAndExit(CmdLineParser parser) {
		System.err.print("Usage: java " + Main.class.getCanonicalName());
		parser.printSingleLineUsage(System.err);
		System.err.println();
		parser.printUsage(System.err);
		System.exit(1);
	}
}
