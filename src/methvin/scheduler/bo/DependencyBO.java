package methvin.scheduler.bo;

import methvin.scheduler.entities.DependencyEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * BO for dependency
 *
 */
public class DependencyBO extends BaseBO {
	@JsonIgnore
	protected Integer id;
	@JsonIgnore
	protected String phantomId;
	protected String from;
	protected String to;
	@JsonIgnore
	protected Integer type;
	@JsonIgnore
	protected String cls;
	@JsonIgnore
	protected Integer lag;
	@JsonIgnore
	protected String lagUnit;

	public DependencyBO() {
	}

	public DependencyBO(DependencyEntity entity) {
		super(entity);
		this.from = entity.getFrom().getId().toString();
		this.to = entity.getTo().getId().toString();
	}

	@JsonProperty(value = "Id")
	public Integer getId() {
		return id;
	}

	@JsonIgnore
	public void setId(Integer id) {
		this.id = id;
	}

	@JsonProperty(value = "PhantomId")
	public String getPhantomId() {
		return phantomId;
	}

	@JsonIgnore
	public void setPhantomId(String phantomId) {
		this.phantomId = phantomId;
	}

	@JsonProperty(value = "From")
	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	@JsonProperty(value = "To")
	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	@JsonProperty(value = "Type")
	public Integer getType() {
		return type;
	}

	@JsonIgnore
	public void setType(Integer type) {
		this.type = type;
	}

	@JsonProperty(value = "Cls")
	public String getCls() {
		return cls;
	}

	@JsonIgnore
	public void setCls(String cls) {
		this.cls = cls;
	}

	@JsonProperty(value = "Lag")
	public Integer getLag() {
		return lag;
	}

	@JsonIgnore
	public void setLag(Integer lag) {
		this.lag = lag;
	}

	@JsonProperty(value = "LagUnit")
	public String getLagUnit() {
		return lagUnit;
	}

	@JsonIgnore
	public void setLagUnit(String lagUnit) {
		this.lagUnit = lagUnit;
	}

}
