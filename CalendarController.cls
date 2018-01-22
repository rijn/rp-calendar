public with sharing class CalendarController {

  @RemoteAction
  public static String schedule(
    String id,
    String name,
    String email
  ) {
    String ret = '';

    if (name == '') {
      return 'Name cannot be empty';
    }

    if (email == '') {
      return 'Email cannot be empty';
    }

    DateTime dtStartTime = DateTime.newInstance(startTime);
    DateTime dtEndTime = DateTime.newInstance(endTime);

    Integer count = [
      SELECT COUNT()
      FROM CalendarEvent__c
      WHERE
           ( StartTime__c < :dtStartTime AND EndTime__c   > :dtStartTime )
        OR ( StartTime__c < :dtEndTime   AND EndTime__c   > :dtEndTime   )
        OR ( StartTime__c > :dtStartTime AND StartTime__c < :dtEndTime   )
        OR ( EndTime__c   > :dtStartTime AND EndTime__c   < :dtEndTime   )
    ];

    if (count != 0) {
      return 'Event overlap';
    }

    try {
      insert new CalendarEvent__c(
        Title__c = title,
        StartTime__c = dtStartTime, EndTime__c = dtEndTime,
        Detail__c = description,
        Email__c = email
      );
    } catch (DmlException e) {
      System.debug('An unexpected error has occurred: ' + e.getMessage());
      ret = e.getMessage();
    }

    return ret;
  }

}
