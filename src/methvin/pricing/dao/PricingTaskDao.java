package methvin.pricing.dao;
import java.util.List;

import methvin.pricing.bo.PricingTaskBulkIdsContainer;
import methvin.pricing.entities.PricingTask;
import methvin.pricing.utilities.Utilites;
import methvin.scheduler.dao.BaseDao;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository(value="pricingTaskDao")
public class PricingTaskDao extends BaseDao<PricingTask> {
	
	
	public List<PricingTask> addTasks(int projectId,List<PricingTask> tasks){
		for (PricingTask task : tasks){
			//todo:remove
			task.setProjectId(projectId);
			Session ses=getSession();
			ses.saveOrUpdate(task);
		}
		return tasks;	
	}
	
	public List<PricingTask> getAll(int projectId) {
		List<PricingTask> tasks= findByCriteria("parentId", Restrictions.eq("projectId", projectId));
		Utilites utilites = new Utilites();
		tasks = tasks.size() > 0 ? utilites.GetPricingTaskHierarchy(tasks) : tasks;			
		return tasks;
	}
	
	public List<PricingTask> updatePricingTask(int projectId,List<PricingTask> tasks){
		for (PricingTask task : tasks){
			task.setProjectId(projectId);
			Session ses=getSession();
			ses.saveOrUpdate(task);
		}
		
		Utilites utilites = new Utilites();
		tasks = tasks.size() > 0 ? utilites.GetPricingTaskHierarchy(tasks) : tasks;
		
		return tasks;	
	}
	
	public void deletePricingTask(List<PricingTask> tasks)
	{
		for (PricingTask task : tasks){
			task.setProjectId(1);
			Session ses=getSession();
			ses.delete(task);
		}
		
	}
	
	public void bulkUpdates(int projectId,List<Integer> tasks)
	{
		if(tasks.size() > 0)
		{
			String hql = "delete from PricingTask where projectId=:projectId and id in (:delIds)";
			Query q= getSession().createQuery(hql);
			q.setParameterList("delIds",tasks);
			q.setParameter("projectId",projectId);
			q.executeUpdate();
		}
	}
	
	public void bulkIndentPricingTasks(int projectId,PricingTaskBulkIdsContainer taskContainer)
	{
		if(taskContainer.parentId > 0 && taskContainer.bulkIds.size() > 0)
		{
			String hql = "update PricingTask set parentId=:parentId where projectId=:projectId and id in (:taskIds)";
			Query q= getSession().createQuery(hql);
			q.setParameterList("taskIds",taskContainer.bulkIds);
			q.setParameter("projectId",projectId);
			q.setParameter("parentId",taskContainer.parentId);
			q.executeUpdate();
		}
	}
	
	public void bulkOutdentPricingTasks(int projectId,PricingTaskBulkIdsContainer taskContainer)
	{
		if(taskContainer.parentId > 0 && taskContainer.bulkIds.size() > 0)
		{
			String hql = "update PricingTask set parentId=:parentId where projectId=:projectId and id in (:taskIds)";
			Query q= getSession().createQuery(hql);
			q.setParameterList("taskIds",taskContainer.bulkIds);
			q.setParameter("projectId",projectId);
			q.setParameter("parentId",taskContainer.parentId);
			q.executeUpdate();
		}
	}


	public List<PricingTask> getLinkedTasks(int linkedTaskId){
		List<PricingTask> tasks= findByCriteria( Restrictions.eq("linkedTaskId", linkedTaskId));
		return tasks;
	}
}
