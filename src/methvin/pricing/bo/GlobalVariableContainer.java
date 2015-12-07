package methvin.pricing.bo;

import java.util.ArrayList;
import java.util.List;

import methvin.pricing.entities.GlobalVariable;

public class GlobalVariableContainer {
	public GlobalVariableContainer(){
		children=new ArrayList<GlobalVariable>();
	}
	public boolean Success;
	public List<GlobalVariable> children;
}
