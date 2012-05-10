package de.farberg.dive.lectures;


public interface Modules {

	Module getModule(String id);

	void addModule(Module module) throws Exception;

	void deleteModule(Module module);

	void addEvaluation(Module module, String lecture, String evaluation);

}
