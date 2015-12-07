package methvin.pricing.bo;
import java.util.ArrayList;
import java.util.List;

public class PricingFormulaBoContainer {
	public PricingFormulaBoContainer(){
		children=new ArrayList<PricingFormulaBo>();
	}
	public boolean Success;
	public List<PricingFormulaBo> children;
}
