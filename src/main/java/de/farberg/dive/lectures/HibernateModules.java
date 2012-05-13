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
			module.evaluations = new LinkedList<Evaluation>();

		module.evaluations.add(e);
		
		entityManager.getTransaction().commit();

	}

}
