package methvin.pricing.bo;

import java.util.ArrayList;
import java.util.List;

import methvin.pricing.entities.PricingProject;

public class ProjectContainer {
	public ProjectContainer(){
		children=new ArrayList<PricingProject>();
	}
	public boolean Success;
	public List<PricingProject> children;
}
