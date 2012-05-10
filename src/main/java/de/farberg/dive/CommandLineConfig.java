package de.farberg.dive;

import org.apache.log4j.Level;
import org.kohsuke.args4j.Option;

import de.farberg.dive.util.Log4JLevelOptionHandler;


public class CommandLineConfig {

	@Option(name = "--database", usage = "Database location.", required = false)
	public String databaseLocation = "lecturedb";

	@Option(name = "--port", usage = "Port to start the web server on.")
	public int webServerPort = 8080;

	@Option(name = "--logLevel", usage = "Set logging level (valid values: TRACE, DEBUG, INFO, WARN, ERROR).", handler = Log4JLevelOptionHandler.class)
	public Level logLevel = null;

	@Option(name = "--verbose", usage = "Verbose (DEBUG) logging output (default: INFO).")
	public boolean verbose = false;

	@Option(name = "--help", usage = "This help message.")
	public boolean help = false;

	@Override
	public String toString() {
		return "{ webServerPort=" + webServerPort + ", logLevel=" + logLevel + ", verbose=" + verbose + '}';
	}
}
