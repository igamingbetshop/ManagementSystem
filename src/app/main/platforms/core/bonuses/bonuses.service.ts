import {Injectable} from '@angular/core';

@Injectable()
export class BonusesService {

  constructor() {
  }

  public getRequestConditions(addedConditions) {

    let condition = {GroupingType: addedConditions.selectedGroupType, Conditions: [], Groups: []};
    for (let i = 0; i < addedConditions.conditions.length; i++) {
      condition.Conditions.push({
        ConditionType: addedConditions.conditions[i].Condition.Id,
        OperationTypeId: addedConditions.conditions[i].ConditionType.Id,
        StringValue: addedConditions.conditions[i].ConditionValue
      });
    }

    for (let i = 0; i < addedConditions.groups.length; i++) {
      let conditionGroup = {
        GroupingType: addedConditions.groups[i].selectedGroupType,
        Conditions: [],
        Groups: []
      };
      for (let j = 0; j < addedConditions.groups[i].conditions.length; j++) {
        conditionGroup.Conditions.push({
          ConditionType: addedConditions.groups[i].conditions[j].Condition.Id,
          OperationTypeId: addedConditions.groups[i].conditions[j].ConditionType.Id,
          StringValue: addedConditions.groups[i].conditions[j].ConditionValue
        });
      }
      for (let j = 0; j < addedConditions.groups[i].groups.length; j++) {
        let conditionSubGroup = {
          GroupingType: addedConditions.groups[i].groups[j].selectedGroupType,
          Conditions: []
        };
        for (let k = 0; k < addedConditions.groups[i].groups[j].conditions.length; k++) {
          conditionSubGroup.Conditions.push({
            ConditionType: addedConditions.groups[i].groups[j].conditions[k].Condition.Id,
            OperationTypeId: addedConditions.groups[i].groups[j].conditions[k].ConditionType.Id,
            StringValue: addedConditions.groups[i].groups[j].conditions[k].ConditionValue
          });
        }
        conditionGroup.Groups.push(conditionSubGroup);
      }
      condition.Groups.push(conditionGroup);
    }
    return condition;

  }

  public getResponseConditions(responseConditions, conditionTypes) {

    const conditions = this.getConditions();
    const condition = {
      selectedGroupType: responseConditions.GroupingType,
      groupTypes: [
        {Id: 1, Name: 'All'},
        {Id: 2, Name: 'Any'}
      ],
      groups: [],
      conditions: [],
      selectedCondition: null,
      selectedConditionType: null,
      selectedConditionValue: null
    };

    for (let i = 0; i < responseConditions.Conditions.length; i++) {
      condition.conditions.push({
        Condition: conditions.find(type => type.Id === responseConditions.Conditions[i].ConditionType),
        ConditionType: conditionTypes.find(type => type.Id === responseConditions.Conditions[i].OperationTypeId),
        ConditionValue: responseConditions.Conditions[i].StringValue
      });
    }

    for (let i = 0; i < responseConditions.Groups.length; i++) {
      let conditionGroup = {
        conditions: [],
        groups: []
      };
      for (let j = 0; j < responseConditions.Groups[i].Conditions.length; j++) {
        conditionGroup.conditions.push({
          Condition: conditions.find(type => type.Id === responseConditions.Groups[i].Conditions[j].ConditionType),
          ConditionType: conditionTypes.find(type => type.Id === responseConditions.Groups[i].Conditions[j].OperationTypeId),
          ConditionValue: responseConditions.Groups[i].Conditions[j].StringValue
        });
      }
      for (let j = 0; j < responseConditions.Groups[i].Groups.length; j++) {
        let conditionSubGroup = {
          conditions: []
        };
        for (let k = 0; k < responseConditions.Groups[i].Groups[j].Conditions.length; k++) {
          conditionSubGroup.conditions.push({
            Condition: conditions.find(type => type.Id === responseConditions.Groups[i].Groups[j].Conditions[k].ConditionType),
            ConditionType: conditionTypes.find(type => type.Id === responseConditions.Groups[i].Groups[j].Conditions[k].OperationTypeId),
            ConditionValue: responseConditions.Groups[i].Groups[j].Conditions[k].StringValue
          });
        }
        conditionGroup.groups.push(conditionSubGroup);
      }
      condition.groups.push(conditionGroup);
    }

    return condition;

  }

  public getConditions() {
    return [
      {Id: 1, Name: 'Sport', Type: 1},
      {Id: 2, Name: 'Region', Type: 1},
      {Id: 3, Name: 'Competition', Type: 1},
      {Id: 4, Name: 'Match', Type: 1},
      {Id: 5, Name: 'Market', Type: 1},
      {Id: 6, Name: 'Selection', Type: 1},
      {Id: 7, Name: 'MarketType', Type: 1},
      {Id: 8, Name: 'SelectionType', Type: 1},
      {Id: 9, Name: 'MatchStatus', Type: 1},
      {Id: 10, Name: 'Price', Type: 1},
      {Id: 11, Name: 'PricePerSelection', Type: 1},
      {Id: 12, Name: 'BetType', Type: 1},
      {Id: 13, Name: 'NumberOfSelections', Type: 1},
      {Id: 14, Name: 'NumberOfWonSelections', Type: 1},
      {Id: 15, Name: 'NumberOfLostSelections', Type: 1},
      {Id: 16, Name: 'Stake', Type: 1},
      {Id: 17, Name: 'BetStatus', Type: 1}
    ];
  }
}
