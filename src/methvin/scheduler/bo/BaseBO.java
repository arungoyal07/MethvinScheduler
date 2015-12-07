package methvin.scheduler.bo;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import methvin.scheduler.bo.containers.SegmentSummaryBO;
import methvin.scheduler.entities.BaseEntity;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Base abstract BO for all possible BOs. Used to provide self-mapping
 * functionalities.
 * 
 * 
 *
 */
public abstract class BaseBO {
	protected final static String DATETIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ssXXX";

	protected String phantomId;

	private List<String> processedFields = new ArrayList<String>();

	public BaseBO() {

	}

	/**
	 * Map data from given Entity to newly created BO All collection are ignored
	 * and must be handled in concreet realizations
	 * 
	 * @param entity
	 * @throws IntrospectionException
	 * @throws InvocationTargetException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 */
	public BaseBO(BaseEntity entity) {
		for (Field field : this.getClass().getDeclaredFields()) {
			if (Collection.class.isAssignableFrom(field.getType()) || SegmentSummaryBO.class.isAssignableFrom(field.getType())) {
				continue;
			}

			String fieldName = field.getName();

			BeanInfo entityInfo;
			try {
				entityInfo = Introspector.getBeanInfo(entity.getClass());
				for (PropertyDescriptor pd : entityInfo.getPropertyDescriptors()) {
					if (pd.getName().equalsIgnoreCase(fieldName)) {
						Method fieldGetter = pd.getReadMethod();
						if (!BaseEntity.class.isAssignableFrom(pd.getPropertyType())) {
							field.set(this, fieldGetter.invoke(entity));
						}

						break;
					}
				}
			} catch (IntrospectionException | IllegalArgumentException | IllegalAccessException | InvocationTargetException e) {
				e.printStackTrace();
			}
		}
	}

	@JsonProperty(value = "PhantomId")
	public String getPhantomId() {
		return phantomId;
	}

	@JsonIgnore
	public void setPhantomId(String phantomId) {
		this.phantomId = phantomId;
	}

	/**
	 * Map BO data to given Entity if fields were provided in JSon which was
	 * deserialized to current BO.
	 * 
	 * @param entity
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 * @throws SecurityException
	 * @throws NoSuchFieldException
	 * @throws IntrospectionException
	 * @throws InvocationTargetException
	 */
	public void mapToEntity(BaseEntity entity) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException, IntrospectionException, InvocationTargetException {
		for (String fieldName : processedFields) {
			// special case for fields which contain $ in name
			fieldName = fieldName.replace("$", "");

			Field boField = null;
			try {
				boField = this.getClass().getDeclaredField(fieldName);
			} catch (NoSuchFieldException nsfe) {
				// if field is not in a current class - check superclass
				boField = this.getClass().getSuperclass().getDeclaredField(fieldName);
			}

			BeanInfo entityInfo = Introspector.getBeanInfo(entity.getClass());
			for (PropertyDescriptor pd : entityInfo.getPropertyDescriptors()) {
				if (pd.getName().equalsIgnoreCase(fieldName)) {
					Method fieldSetter = pd.getWriteMethod();
					fieldSetter.invoke(entity, boField.get(this));

					break;
				}
			}
		}
	}

	/**
	 * Collect serialized fields data and set values to BO
	 * 
	 * @param name
	 * @param value
	 * @throws NoSuchFieldException
	 * @throws SecurityException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws ParseException
	 */
	@JsonAnySetter()
	public void set(String name, Object value) throws NoSuchFieldException, SecurityException, IllegalArgumentException, IllegalAccessException, ParseException {
		// special case for fields which contain $ in name
		name = name.replace("$", "");

		name = Introspector.decapitalize(name);

		Field boField = null;
		try {
			boField = this.getClass().getDeclaredField(name);
		} catch (NoSuchFieldException nsfe) {
			// if field is not in a current class - check superclass
			boField = this.getClass().getSuperclass().getDeclaredField(name);
		}

		// Convert string date value to a real Date
		if (boField.getType().isAssignableFrom(Date.class) && value != null && value.toString().length() > 0) {
			SimpleDateFormat sdm = new SimpleDateFormat(DATETIME_PATTERN);
			value = sdm.parseObject(value.toString());
		} else if (boField.getType().isAssignableFrom(Double.class) && value != null) {
			value = Double.valueOf(value.toString());
		}

		if (value == null) {
			boField.set(this, null);
		} else if (boField.getType().equals(String.class)) {
			boField.set(this, value.toString());
		} else if (boField.getType().equals(Double.class)) {
			boField.set(this, Double.parseDouble(value.toString()));
		} else {
			boField.set(this, boField.getType().cast(value));
		}

		processedFields.add(name);
	}

	/**
	 * Clear all values in BO. Used to keep link from collection to the object,
	 * but fill it with new data
	 * 
	 * @throws IllegalAccessException
	 * @throws IllegalArgumentException
	 */
	public void clear() throws IllegalArgumentException, IllegalAccessException {
		for (Field field : this.getClass().getDeclaredFields()) {
			field.set(this, null);
		}
	}

	public final class RequestView {
	};

	public final class ResponseView {
	};
}
