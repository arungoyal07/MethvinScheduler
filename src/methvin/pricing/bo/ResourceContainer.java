package methvin.pricing.bo;

import java.util.ArrayList;
import java.util.List;

import methvin.pricing.entities.PricingResource;

public class ResourceContainer {
	public ResourceContainer(){
		children=new ArrayList<PricingResource>();
	}
	public boolean Success;
	public List<PricingResource> children;
}
