package methvin.pricing.dao;
import java.util.HashMap;
import java.util.List;

import methvin.pricing.entities.PricingResource;
import methvin.pricing.utilities.Utilites;
import methvin.scheduler.dao.BaseDao;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository(value="pricingResourceDao")
public class PricingResourceDao extends BaseDao<PricingResource> {
	
	public List<PricingResource> updatePricingResourcee(List<PricingResource> formulae){
		for (PricingResource formula : formulae){
			formula.setProjectId(1);
			Session ses=getSession();
			ses.saveOrUpdate(formula);
		}
		return formulae;
	}
	
	public List<PricingResource> getResources(int projectId) {
		List<PricingResource> resources= findByCriteria("parentId", Restrictions.eq("projectId", projectId));
		resources = resources.size() > 0 ? new Utilites().GetPricingResourceHierarchy(resources) : resources;			
		return resources;
	}
		
	public List<PricingResource> addPricingResourcee(List<PricingResource> formulae){
		
		HashMap<Integer, Integer> formulaClientIdMap=new HashMap<Integer,Integer>();
		
		//new formulas on first level
		for (PricingResource formula : formulae){
			if(formula.getId()==0 && formula.getParentId()==0){
				formula.setProjectId(1);
				Session ses=getSession();
				ses.saveOrUpdate(formula);
				formulaClientIdMap.put(formula.getClientId(), formula.getId());
			}
		}		
		
		//new formulas on second level
		for (PricingResource formula : formulae){
			if(formula.getId()==0 && !(formula.getParentId()==0)){
				int foundIid=formulaClientIdMap.get(formula.getParentId());
				formula.setParentId(foundIid);
				formula.setProjectId(1);
				Session ses=getSession();
				ses.saveOrUpdate(formula);
			}
		}
		
		//TODO: don't forget the case when existing formula is moved under a new formula
		//it would be update but with wrong parent id
		
		return formulae;	
	}

}
