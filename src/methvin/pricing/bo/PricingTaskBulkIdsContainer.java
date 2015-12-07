package methvin.pricing.bo;

import java.util.ArrayList;
import java.util.List;

public class PricingTaskBulkIdsContainer {

	public PricingTaskBulkIdsContainer(){
		bulkIds=new ArrayList<Integer>();
	}
	public boolean Success;
	public List<Integer> bulkIds;
	public int parentId = 0;
	
}
