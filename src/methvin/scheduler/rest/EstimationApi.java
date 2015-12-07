package methvin.scheduler.rest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import methvin.pricing.bo.GlobalVariableContainer;
import methvin.pricing.bo.PricingFormulaEntityContainer;
import methvin.pricing.bo.PricingTaskBulkIdsContainer;
import methvin.pricing.bo.ProjectContainer;
import methvin.pricing.bo.ResourceContainer;
import methvin.pricing.bo.TaskContainer;
import methvin.pricing.dao.GlobalVariableDao;
import methvin.pricing.dao.PricingFormulaDao;
import methvin.pricing.dao.PricingResourceDao;
import methvin.pricing.dao.PricingTaskDao;
import methvin.pricing.dao.ProjectDao;
import methvin.pricing.entities.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
@Path("/estimation")
@Component
public class EstimationApi {
	
	@Autowired
	private PricingTaskDao pricingTaskDao;
	
	@Autowired
	private PricingFormulaDao pricingFormulaDao;
	

	@Autowired
	private ProjectDao projectDao;
	
	@Autowired
	private GlobalVariableDao globalVaiableDao;
	
	@Autowired
	private PricingResourceDao resourceDao;
	
	@POST
	@Path("/authenticate")
	@Consumes("application/json")
	@Produces("application/json")
	public TaskContainer updateTask(User user){
		
		TaskContainer result=new TaskContainer();
		result.Success=true;
		return result;
	}
	
	@POST
	@Path("/addtasks/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public TaskContainer updateTask(@PathParam("projectId") int projectId,TaskContainer taskContainer){
		pricingTaskDao.addTasks(projectId,taskContainer.children);
		taskContainer.Success=true;
		return taskContainer;
	}	
	
	@POST
	@Path("/updatetasks/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public TaskContainer saveTask(@PathParam("projectId") int projectId,TaskContainer taskContainer){
		pricingTaskDao.updatePricingTask(projectId,taskContainer.children);
		taskContainer.Success=true;
		return taskContainer;
	}	
	
	@POST
	@Path("/deletetasks")
	@Consumes("application/json")
	//@Produces("application/json")
	public TaskContainer deleteTasks(TaskContainer taskContainer){
		pricingTaskDao.deletePricingTask(taskContainer.children);
		taskContainer.Success=true;
		return taskContainer;
	}	
	
	@POST
	@Path("/bulkupdates/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public PricingTaskBulkIdsContainer bulkTaskDelete(@PathParam("projectId") int projectId, PricingTaskBulkIdsContainer taskContainer){
		pricingTaskDao.bulkUpdates(projectId, taskContainer.bulkIds);
		taskContainer.Success=true;
		return taskContainer;
	}
	
	@POST
	@Path("/bulkindentpricingtasks/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public PricingTaskBulkIdsContainer bulkIndentPricingTasks(@PathParam("projectId") int projectId, PricingTaskBulkIdsContainer taskContainer){
		pricingTaskDao.bulkIndentPricingTasks(projectId, taskContainer);
		taskContainer.Success=true;
		return taskContainer;
	}
	
	
	@POST
	@Path("/bulkoutdent/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public PricingTaskBulkIdsContainer bulkOutdentPricingTasks(@PathParam("projectId") int projectId, PricingTaskBulkIdsContainer taskContainer){
		pricingTaskDao.bulkOutdentPricingTasks(projectId, taskContainer);
		taskContainer.Success=true;
		return taskContainer;
	}
	
	
	@GET
	@Path("/gettasks/{projectId}")
	@Produces("application/json")
	public TaskContainer getAll(@PathParam("projectId") int projectId){
		TaskContainer container=new TaskContainer();
		container.children=pricingTaskDao.getAll(projectId);
		container.Success=true;
		return container;		
	}
	
	
	@GET
	@Path("/getlinkedtasks/{projectId}/{linkedTaskId}")
	@Produces("application/json")
	public TaskContainer getAll(@PathParam("projectId") int projectId,@PathParam("linkedTaskId") int linkedTaskId){
		TaskContainer container=new TaskContainer();
		container.children=pricingTaskDao.getLinkedTasks(linkedTaskId);
		container.Success=true;
		return container;		
	}
	
	
	@POST
	@Path("/addpricingformulae/{projectId}/{taskId}")
	@Consumes("application/json")
	@Produces("application/json")
	public PricingFormulaEntityContainer addPricingFormulae(@PathParam("projectId") int projectId,@PathParam("taskId") int taskId,PricingFormulaEntityContainer formulaContainer){
		PricingFormulaEntityContainer container=new PricingFormulaEntityContainer();
		container.children= pricingFormulaDao.addPricingFormulae(formulaContainer.children);
		container.Success=true;
		return container;
	}	
	
	@POST
	@Path("/updatepricingformulae/{projectId}/{taskId}")
	@Consumes("application/json")
	@Produces("application/json")
	public PricingFormulaEntityContainer updatePricingFormulae(@PathParam("projectId") int projectId,@PathParam("taskId") int taskId,PricingFormulaEntityContainer formulaContainer){
		pricingFormulaDao.updatePricingFormulae(formulaContainer.children);
		formulaContainer.Success=true;
		return formulaContainer;
	}	
	
	@GET
	@Path("/getpricingformulae/{projectId}/{taskId}")
	@Produces("application/json")
	public PricingFormulaEntityContainer getAllPricingFormulae(@PathParam("projectId") int projectId,@PathParam("taskId") int taskId){
		PricingFormulaEntityContainer container=new PricingFormulaEntityContainer();
		container.children=pricingFormulaDao.getAll();
		container.Success=true;
		return container;		
	}	
	
	@GET
	@Path("/getprojects/{companyId}")
	@Produces("application/json")
	public ProjectContainer getComanyProjects(@PathParam("companyId") int companyId){
		ProjectContainer container=new ProjectContainer();
		container.children=projectDao.getCompanyPricingProjects(companyId);
		container.Success=true;
		return container;		
	}
	
	@POST
	@Path("/addprojects/{companyId}")
	@Consumes("application/json")
	@Produces("application/json")
	public ProjectContainer addProjects(@PathParam("companyId") int companyId,ProjectContainer projectContainer){
		projectDao.updatePricingProjects(companyId,projectContainer.children);
		projectContainer.Success=true;
		return projectContainer;
	}
	
	@POST
	@Path("/updateprojects/{companyId}")
	@Consumes("application/json")
	@Produces("application/json")
	public ProjectContainer updateProjects(@PathParam("companyId") int companyId,ProjectContainer projectContainer){
		projectDao.updatePricingProjects(companyId,projectContainer.children);
		projectContainer.Success=true;
		return projectContainer;
	}
	
	@POST
	@Path("/deleteprojects/{companyId}")
	@Consumes("application/json")
	@Produces("application/json")
	public ProjectContainer delteProjects(@PathParam("companyId") int companyId,ProjectContainer projectContainer){
		projectDao.deletePricingProjects(projectContainer.children);
		projectContainer.Success=true;
		return projectContainer;
	}
	
	
	@GET
	@Path("/getglobalvariables/{projectId}")
	@Produces("application/json")
	public GlobalVariableContainer getGlobalVariables(@PathParam("projectId") int projectId){
		GlobalVariableContainer container=new GlobalVariableContainer();
		container.children=globalVaiableDao.getProjectGlobalVariables(projectId);
		container.Success=true;
		return container;		
	}
	
	@POST
	@Path("/addglobalvariables/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public GlobalVariableContainer addGlobalVariables(@PathParam("projectId") int projectId,GlobalVariableContainer globalVariableContainer){
		globalVaiableDao.updateGlobalVariables(projectId,globalVariableContainer.children);
		globalVariableContainer.Success=true;
		return globalVariableContainer;
	}
	
	@POST
	@Path("/updateglobalvariables/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public GlobalVariableContainer updateGlobalVariables(@PathParam("projectId") int projectId,GlobalVariableContainer globalVariableContainer){
		globalVaiableDao.updateGlobalVariables(projectId,globalVariableContainer.children);
		globalVariableContainer.Success=true;
		return globalVariableContainer;
	}
	
	@POST
	@Path("/deleteglobalvariables/{projectId}")
	@Consumes("application/json")
	@Produces("application/json")
	public GlobalVariableContainer delteGlobalVariables(@PathParam("projectId") int projectId,GlobalVariableContainer globalVariableContainer){
		globalVaiableDao.deleteGlobalVariables(globalVariableContainer.children);
		globalVariableContainer.Success=true;
		return globalVariableContainer;
	}	
	
	@GET
	@Path("/getresources/{projectId}")
	@Produces("application/json")
	public ResourceContainer getResources(@PathParam("projectId") int projectId){
		ResourceContainer container=new ResourceContainer();
		container.children=resourceDao.getResources(projectId);
		container.Success=true;
		return container;		
	}
	
}
