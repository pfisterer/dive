package de.farberg.dive;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;

import com.google.inject.Inject;
import com.sun.jersey.api.client.ClientResponse.Status;

import de.farberg.dive.dto.CreateModuleDto;
import de.farberg.dive.dto.EvaluationsDto;
import de.farberg.dive.dto.RequestEvaluationsDto;
import de.farberg.dive.dto.SubmitEvaluationDto;
import de.farberg.dive.lectures.Module;
import de.farberg.dive.lectures.Modules;
import de.farberg.dive.util.Base64Helper;
import de.farberg.dive.util.InjectLogger;
import de.farberg.dive.util.JSONHelper;

@Path("/")
public class RootResource {

	@InjectLogger
	private Logger log;

	@Inject
	private Modules lectures;

	@Path("/modules/add")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public Response addModule(CreateModuleDto createLectureDto) {

		Module module = new Module();
		module.name = Base64Helper.decode(createLectureDto.name);
		module.md5OfUserKey = Base64Helper.decode(createLectureDto.md5OfUserKey);
		module.md5OfAdminKey = Base64Helper.decode(createLectureDto.md5OfAdminKey);

		log.debug("Called addLecture with name 			= {}", module.name);
		log.debug("Called addLecture with md5OfUserKey 	= {}", module.md5OfUserKey);
		log.debug("Called addLecture with md5OfAdminKey = {}", module.md5OfAdminKey);

		try {
			lectures.addModule(module);
			log.info("Added new lecture: {}", JSONHelper.toJSON(module));

			return Response.ok("{\"ok\": \"true\" }").build();
		} catch (Exception e) {
			log.debug(" :" + e, e);
			return Response.status(Status.CONFLICT).build();
		}

	}

	@Path("/evaluation/submit")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public Response submitEvaluation(SubmitEvaluationDto evaluation) {
		log.debug("Called submit evaluation with {}", JSONHelper.toJSON(evaluation));

		// De-Base64
		evaluation.encryptedEvaluation = Base64Helper.decode(evaluation.encryptedEvaluation);
		evaluation.md5OfUserKey = Base64Helper.decode(evaluation.md5OfUserKey);

		Module module = lectures.getModule(evaluation.moduleId);

		// Check if it exists
		if (module == null) {
			log.warn("Module not found {}", evaluation.moduleId);
			return Response.status(Status.NOT_FOUND).build();
		}

		// Check that the submitter knows the password
		if (!module.md5OfUserKey.equals(evaluation.md5OfUserKey)) {
			log.warn("MD5 of keys don't match {} != {}", module.md5OfUserKey, evaluation.md5OfUserKey);
			return Response.status(Status.FORBIDDEN).build();
		}

		// Add the evaluation
		lectures.addEvaluation(module, evaluation.lecture, evaluation.encryptedEvaluation);

		return Response.ok("{\"ok\": \"true\" }").build();
	}

	@POST
	@Path("/evaluation")
	@Consumes({ MediaType.APPLICATION_JSON })
	@Produces({ MediaType.APPLICATION_JSON })
	public Response getEvaluations(RequestEvaluationsDto req) { // De-Base64
		req.moduleName = Base64Helper.decode(req.moduleName);
		req.md5OfAdminKey = Base64Helper.decode(req.md5OfAdminKey);
		
		log.debug("Module evaluations requested for {}", req.moduleName);

		Module module = lectures.getModule(req.moduleName);

		// Check if it exists
		if (module == null) {
			log.warn("Module not found {}", req.moduleName);
			return Response.status(Status.NOT_FOUND).build();
		}

		// Check that the submitter knows the password
		if (!module.md5OfAdminKey.equals(req.md5OfAdminKey)) {
			log.warn("MD5 of keys don't match {} != {}", module.md5OfAdminKey, req.md5OfAdminKey);
			return Response.status(Status.FORBIDDEN).build();
		}
		
		EvaluationsDto dto = new EvaluationsDto();
		dto.stringModuleName = req.moduleName;
		dto.evaluations.addAll(module.evaluations);

		log.debug("Ok, found {} evaluations", dto.evaluations.size());
		
		return Response.ok(dto).build();
	}

}
