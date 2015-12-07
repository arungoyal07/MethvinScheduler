package methvin.pricing.bo;

import java.util.ArrayList;
import java.util.List;

import methvin.pricing.entities.PricingTask;

public class TaskContainer {
	public TaskContainer(){
		children=new ArrayList<PricingTask>();
	}
	public boolean Success;
	public List<PricingTask> children;
}
