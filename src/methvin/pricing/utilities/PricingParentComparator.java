package methvin.pricing.utilities;

import java.util.Comparator;
import methvin.pricing.entities.PricingHierarchyBase;

public class PricingParentComparator implements Comparator<PricingHierarchyBase>{

	public int compare(PricingHierarchyBase x, PricingHierarchyBase y) {
		return (x.getParentId() == 0 && y.getParentId() == 0) ? 0 : x.getParentId()- y.getParentId();
	}

}
