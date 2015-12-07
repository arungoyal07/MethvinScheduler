package methvin.scheduler.rest;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import methvin.scheduler.bo.BaseBO;
import methvin.scheduler.bo.containers.RequestSummaryBO;
import methvin.scheduler.parser.JsonProcessorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * REST listener that consumes JSON, CRUD given data and returns a response with
 * set IDs (to map PhantomID to real ID)
 * 
 * @author dkomarch
 *
 */
@Path("/json")
@Component
public class JsonResource {
	@Autowired
	private JsonProcessorService jsonProcessor;

	/**
	 * CRUD given JSON data
	 * 
	 * @param jsonData
	 * @return Map of given PhantomIDs and real IDs of newly inserted objects
	 */
	@Path("/crud/{projectId}")
	@POST
	public Response crudData(@FormParam("jsonData") String jsonData, @PathParam("projectId") Integer projectId) {
		boolean success = true;
		RequestSummaryBO summary = new RequestSummaryBO();
		ObjectMapper mapper = new ObjectMapper();

		try {
			mapper.setConfig(mapper.getSerializationConfig().withView(BaseBO.RequestView.class));
			mapper.configure(MapperFeature.DEFAULT_VIEW_INCLUSION, true);
			mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

			summary = mapper.readValue(jsonData, RequestSummaryBO.class);
			jsonProcessor.process(summary, projectId);
		} catch (Exception e) {
			e.printStackTrace();
			success = false;
		}

		summary.setSuccess(success);
		jsonProcessor.prepareForResponse(summary);

		String response = null;
		try {
			response = mapper.writer().withView(BaseBO.RequestView.class).writeValueAsString(summary);
		} catch (JsonProcessingException jpe) {
			jpe.printStackTrace();
		}

		return Response.status(Status.OK).entity(response).build();
	}

	@Path("/crud/{projectId}")
	@GET
	public Response getData(@PathParam("projectId") Integer projectId) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			String response = mapper.writer().withView(BaseBO.ResponseView.class).writeValueAsString(jsonProcessor.getData(projectId));
			return Response.status(Status.OK).entity(response).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}
	}
}
