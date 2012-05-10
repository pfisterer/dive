package de.farberg.dive.lectures;

import java.sql.Time;
import java.util.LinkedList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.google.inject.Inject;

public class HibernateModules implements Modules {
	@Inject
	private EntityManager entityManager;

	@Override
	public Module getModule(String name) {
		String queryString = "FROM " + Module.class.getSimpleName() + " WHERE name = :name";
		TypedQuery<Module> query = entityManager.createQuery(queryString, Module.class);
		query.setParameter("name", name);
		List<Module> resultList = query.getResultList();

		if (resultList.size() > 0)
			return resultList.get(0);
		else
			return null;
	}

	@Override
	public void addModule(Module module) throws Exception {
		if (getModule(module.name) != null)
			throw new Exception("Already exists");

		entityManager.getTransaction().begin();
		entityManager.persist(module);
		entityManager.getTransaction().commit();
	}

	@Override
	public void deleteModule(Module module) {
		entityManager.getTransaction().begin();
		Query query = entityManager.createQuery("DELETE FROM " + Module.class.getSimpleName() + " WHERE name = :name");
		query.setParameter("name", module.name);
		query.executeUpdate();
		entityManager.getTransaction().commit();
	}

	@Override
	public void addEvaluation(Module module, String lecture, String evaluation) {
		entityManager.getTransaction().begin();

		Evaluation e = new Evaluation();
		e.creationTime = new Time(System.currentTimeMillis());
		e.lecture = lecture;
		e.encryptedContent = evaluation;

		if (module.evaluations == null)
			module.evaluations = new LinkedList<>();

		module.evaluations.add(e);
		
		entityManager.getTransaction().commit();

	}

}
