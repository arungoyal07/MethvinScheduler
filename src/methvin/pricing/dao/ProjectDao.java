package methvin.pricing.dao;
import java.util.List;

import methvin.pricing.entities.PricingProject;
import methvin.pricing.utilities.Utilites;
import methvin.scheduler.dao.BaseDao;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository(value = "PricingProjectDao")
public class ProjectDao extends BaseDao<PricingProject> {

	public List<PricingProject> updatePricingProjects(int companyId,List<PricingProject> formulae) {
		for (PricingProject formula : formulae) {
			formula.setCompanyId(companyId);
			Session ses = getSession();
			ses.saveOrUpdate(formula);
		}
		return formulae;
	}

	public List<PricingProject> addPricingProjects(List<PricingProject> projects) {

		// new formulas on first level
		for (PricingProject project : projects) {
			project.setCompanyId(1);
			Session ses = getSession();
			ses.saveOrUpdate(project);
		}

		return projects;
	}

	public List<PricingProject> getCompanyPricingProjects(int companyId) {
		List<PricingProject> tasks = findByCriteria("parentId",Restrictions.eq("companyId", companyId));
		
		tasks = tasks.size() > 0 ? new Utilites().GetPricingProjectHierarchy(tasks) : tasks;	
		return tasks;
	}
	
	public void deletePricingProjects(List<PricingProject> tasks)
	{
		for (PricingProject task : tasks){
			Session ses=getSession();
			ses.delete(task);
		}		
	}

}
