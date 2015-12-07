package methvin.pricing.dao;

import java.util.HashMap;
import java.util.List;

import methvin.pricing.entities.PricingFormula;
import methvin.scheduler.dao.BaseDao;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

@Repository(value="pricingFormulaDao")
public class PricingFormulaDao extends BaseDao<PricingFormula> {
	
	public List<PricingFormula> updatePricingFormulae(List<PricingFormula> formulae){
		for (PricingFormula formula : formulae){
			formula.setProjectId(1);
			Session ses=getSession();
			ses.saveOrUpdate(formula);
		}
		return formulae;
	}
		
	public List<PricingFormula> addPricingFormulae(List<PricingFormula> formulae){
		
		HashMap<Integer, Integer> formulaClientIdMap=new HashMap<Integer,Integer>();
		
		//new formulas on first level
		for (PricingFormula formula : formulae){
			if(formula.getId()==0 && formula.getParentId()==0){
				//PricingFormula dbFormula=mapPricingFormulaBo(formula,formulaClientIdMap);
				formula.setProjectId(1);
				Session ses=getSession();
				ses.saveOrUpdate(formula);
				formulaClientIdMap.put(formula.getClientId(), formula.getId());
			}
		}		
		
		//new formulas on second level
		for (PricingFormula formula : formulae){
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
	
	public List<PricingFormula> getAll(int projectId,int taskId) {
		List<PricingFormula> tasks= findByCriteria( Restrictions.eq("projectId", 1),Restrictions.eq("taskId", taskId));
		return tasks;
	}

}
