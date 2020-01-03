package com.gift.maddie.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Poke.class)
public abstract class Poke_ {

	public static volatile SingularAttribute<Poke, String> heartTime;
	public static volatile SingularAttribute<Poke, String> mailTime;
	public static volatile SingularAttribute<Poke, String> massageTime;
	public static volatile SingularAttribute<Poke, Long> id;

	public static final String HEART_TIME = "heartTime";
	public static final String MAIL_TIME = "mailTime";
	public static final String MASSAGE_TIME = "massageTime";
	public static final String ID = "id";

}

