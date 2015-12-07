package methvin.pricing.utilities;

import java.util.Comparator;
import methvin.pricing.entities.PricingHierarchyBase;

public class PricingSequenceComparator implements Comparator<PricingHierarchyBase>{

	public int compare(PricingHierarchyBase x, PricingHierarchyBase y) {
		return (x.getSequenceId()== 0 && y.getSequenceId() == 0) ? 0 : x.getSequenceId()- y.getSequenceId();
	}

}
