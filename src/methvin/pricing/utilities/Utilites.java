package methvin.pricing.utilities;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import methvin.pricing.entities.PricingFormula;
import methvin.pricing.entities.PricingProject;
import methvin.pricing.entities.PricingResource;
import methvin.pricing.entities.PricingTask;


public class Utilites {
	private PricingParentComparator pricingParentComparator;
	private PricingSequenceComparator pricingSequenceComparator;

	
	public List<PricingTask> GetPricingTaskHierarchy(List<PricingTask> list) {
		pricingSequenceComparator = new PricingSequenceComparator();
		pricingParentComparator = new PricingParentComparator();
		PricingTask dummyObject = new PricingTask();
		PricingTask parent = new PricingTask();
		PushTaskWithParentId(parent, list, 0, 0);
		InsertChildRecursive(parent, list, dummyObject);
	    		
		return parent.children;
	}
	
	
	

	private int PushTaskWithParentId(PricingTask parent, List<PricingTask> list, int startIndex, int parentId) {
		int originalStartIndex = startIndex;
		int maxIndex = list.size() - 1;

		List<PricingTask> localList = new ArrayList<PricingTask>();
		while (originalStartIndex >= 0) {
			PricingTask element = list.get(originalStartIndex--);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		originalStartIndex = startIndex + 1;
		while (originalStartIndex <= maxIndex) {
			PricingTask element = list.get(originalStartIndex++);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		if (parent.children == null) {
			parent.children = new ArrayList<PricingTask>();
		}

		if (localList.size() == 0) {
			parent.setLeaf(true);
		} else {
			parent.setLeaf(false);
		}

		Collections.sort(localList, pricingSequenceComparator);
		parent.children.addAll(localList);

		return originalStartIndex;
	}

	private void InsertChildRecursive(PricingTask parent, List<PricingTask> list, PricingTask dummyTask) {

		for (PricingTask task : parent.children) {
			dummyTask.setParentId(task.getId());
			int index = Collections.binarySearch(list, dummyTask, pricingParentComparator);
			if (index >= 0) {
				PushTaskWithParentId(task, list, index, task.getId());
				InsertChildRecursive(task, list, dummyTask);
			}
		}
	}
	
	
	public List<PricingProject> GetPricingProjectHierarchy(List<PricingProject> list) {
		pricingSequenceComparator = new PricingSequenceComparator();
		pricingParentComparator = new PricingParentComparator();
		PricingProject dummyObject = new PricingProject();
		PricingProject parent = new PricingProject();
		PushTaskWithParentId(parent, list, 0, 0);
		InsertChildRecursive(parent, list, dummyObject);	    		
		return parent.children;
	}
	
	private int PushTaskWithParentId(PricingProject parent, List<PricingProject> list, int startIndex, int parentId) {
		int originalStartIndex = startIndex;
		int maxIndex = list.size() - 1;

		List<PricingProject> localList = new ArrayList<PricingProject>();
		while (originalStartIndex >= 0) {
			PricingProject element = list.get(originalStartIndex--);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		originalStartIndex = startIndex + 1;
		while (originalStartIndex <= maxIndex) {
			PricingProject element = list.get(originalStartIndex++);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		if (parent.children == null) {
			parent.children = new ArrayList<PricingProject>();
		}

		if (localList.size() == 0) {
			parent.setLeaf(true);
		} else {
			parent.setLeaf(false);
		}

		Collections.sort(localList, pricingSequenceComparator);
		parent.children.addAll(localList);

		return originalStartIndex;
	}

	private void InsertChildRecursive(PricingProject parent, List<PricingProject> list, PricingProject dummyTask) {

		for (PricingProject task : parent.children) {
			dummyTask.setParentId(task.getId());
			int index = Collections.binarySearch(list, dummyTask, pricingParentComparator);
			if (index >= 0) {
				PushTaskWithParentId(task, list, index, task.getId());
				InsertChildRecursive(task, list, dummyTask);
			}
		}
	}
	
	
	public List<PricingFormula> GetPricingFormulaHierarchy(List<PricingFormula> list) {
		pricingSequenceComparator = new PricingSequenceComparator();
		pricingParentComparator = new PricingParentComparator();
		PricingFormula dummyObject = new PricingFormula();
		PricingFormula parent = new PricingFormula();
		PushTaskWithParentId(parent, list, 0, 0);
		InsertChildRecursive(parent, list, dummyObject);	    		
		return parent.children;
	}
	
	private int PushTaskWithParentId(PricingFormula parent, List<PricingFormula> list, int startIndex, int parentId) {
		int originalStartIndex = startIndex;
		int maxIndex = list.size() - 1;

		List<PricingFormula> localList = new ArrayList<PricingFormula>();
		while (originalStartIndex >= 0) {
			PricingFormula element = list.get(originalStartIndex--);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		originalStartIndex = startIndex + 1;
		while (originalStartIndex <= maxIndex) {
			PricingFormula element = list.get(originalStartIndex++);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		if (parent.children == null) {
			parent.children = new ArrayList<PricingFormula>();
		}

		if (localList.size() == 0) {
			parent.setLeaf(true);
		} else {
			parent.setLeaf(false);
		}

		Collections.sort(localList, pricingSequenceComparator);
		parent.children.addAll(localList);

		return originalStartIndex;
	}

	private void InsertChildRecursive(PricingFormula parent, List<PricingFormula> list, PricingFormula dummyTask) {

		for (PricingFormula task : parent.children) {
			dummyTask.setParentId(task.getId());
			int index = Collections.binarySearch(list, dummyTask, pricingParentComparator);
			if (index >= 0) {
				PushTaskWithParentId(task, list, index, task.getId());
				InsertChildRecursive(task, list, dummyTask);
			}
		}
	}
	
	
	public List<PricingResource> GetPricingResourceHierarchy(List<PricingResource> list) {
		pricingSequenceComparator = new PricingSequenceComparator();
		pricingParentComparator = new PricingParentComparator();
		PricingResource dummyObject = new PricingResource();
		PricingResource parent = new PricingResource();
		PushTaskWithParentId(parent, list, 0, 0);
		InsertChildRecursive(parent, list, dummyObject);	    		
		return parent.children;
	}
	
	private int PushTaskWithParentId(PricingResource parent, List<PricingResource> list, int startIndex, int parentId) {
		int originalStartIndex = startIndex;
		int maxIndex = list.size() - 1;

		List<PricingResource> localList = new ArrayList<PricingResource>();
		while (originalStartIndex >= 0) {
			PricingResource element = list.get(originalStartIndex--);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		originalStartIndex = startIndex + 1;
		while (originalStartIndex <= maxIndex) {
			PricingResource element = list.get(originalStartIndex++);
			if (element.getParentId() == parentId) {
				localList.add(element);
			} else {
				break;
			}
		}

		if (parent.children == null) {
			parent.children = new ArrayList<PricingResource>();
		}

		if (localList.size() == 0) {
			parent.setLeaf(true);
		} else {
			parent.setLeaf(false);
		}

		Collections.sort(localList, pricingSequenceComparator);
		parent.children.addAll(localList);

		return originalStartIndex;
	}

	private void InsertChildRecursive(PricingResource parent, List<PricingResource> list, PricingResource dummyTask) {

		for (PricingResource task : parent.children) {
			dummyTask.setParentId(task.getId());
			int index = Collections.binarySearch(list, dummyTask, pricingParentComparator);
			if (index >= 0) {
				PushTaskWithParentId(task, list, index, task.getId());
				InsertChildRecursive(task, list, dummyTask);
			}
		}
	}
	
	
}
