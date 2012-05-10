package de.farberg.dive.dto;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CreateModuleDto {
	public String name;

	public String md5OfUserKey;

	public String md5OfAdminKey;
}
