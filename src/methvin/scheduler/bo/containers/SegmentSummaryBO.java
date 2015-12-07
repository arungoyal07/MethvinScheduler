package methvin.scheduler.bo.containers;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(content = Include.NON_NULL)
public class SegmentSummaryBO<T> {

	private List<T> rows = new ArrayList<T>();
	private List<T> added = new ArrayList<T>();
	private List<T> updated = new ArrayList<T>();
	private List<T> removed = new ArrayList<T>();

	public List<T> getRows() {
		return rows;
	}

	public void setRows(List<T> rows) {
		this.rows = rows;
	}

	public List<T> getAdded() {
		return added;
	}

	public void setAdded(List<T> added) {
		this.added = added;
	}

	public List<T> getUpdated() {
		return updated;
	}

	public void setUpdated(List<T> updated) {
		this.updated = updated;
	}

	public List<T> getRemoved() {
		return removed;
	}

	public void setRemoved(List<T> removed) {
		this.removed = removed;
	}

}
