package methvin.pricing.bo;
import java.util.ArrayList;
import java.util.List;
import methvin.pricing.entities.PricingFormula;

public class PricingFormulaEntityContainer {
	public PricingFormulaEntityContainer(){
		children=new ArrayList<PricingFormula>();
	}
	public boolean Success;
	public List<PricingFormula> children;
}
