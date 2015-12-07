package methvin.pricing.dao;
import java.util.List;

import methvin.pricing.entities.GlobalVariable;
import methvin.scheduler.dao.BaseDao;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository(value = "PricingGlobalVariableDao")
public class GlobalVariableDao extends BaseDao<GlobalVariable> {

	public List<GlobalVariable> updateGlobalVariables(int projectId,List<GlobalVariable> variables) {
		for (GlobalVariable variable : variables) {
			variable.setProjectId(projectId);
			Session ses = getSession();
			ses.saveOrUpdate(variable);
		}
		return variables;
	}


	public List<GlobalVariable> getProjectGlobalVariables(int projectId) {
		List<GlobalVariable> variables = findByCriteria("sequenceId",Restrictions.eq("projectId", projectId));
		return variables;
	}
	
	public void deleteGlobalVariables(List<GlobalVariable> variables)
	{
		for (GlobalVariable variable : variables){
			Session ses=getSession();
			ses.delete(variable);
		}		
	}

}
