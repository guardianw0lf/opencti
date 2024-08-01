import React, { FunctionComponent } from 'react';
import { TargetEntity } from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import {
  StixDomainObjectAttackPatternsKillChainContainer_data$data,
} from '@components/common/stix_domain_objects/__generated__/StixDomainObjectAttackPatternsKillChainContainer_data.graphql';
import AttackPatternsMatrixInLine from '@components/techniques/attack_patterns/AttackPatternsMatrixInLine';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { emptyFilterGroup } from '../../../../utils/filters/filtersUtils';
import ListLines from '../../../../components/list_lines/ListLines';

interface StixDomainObjectAttackPatternsKillChainMatrixProps {
  searchTerm: string;
  data: StixDomainObjectAttackPatternsKillChainContainer_data$data;
  handleToggleColorsReversed: () => void;
  currentColorsReversed: boolean;
  handleAdd: (entity: TargetEntity) => void;
}
const StixDomainObjectAttackPatternsKillChainMatrixInline: FunctionComponent<StixDomainObjectAttackPatternsKillChainMatrixProps> = (
  {
    searchTerm,
    data,
    handleToggleColorsReversed,
    currentColorsReversed,
    handleAdd,
  },
) => {
  const attackPatterns = (data.attackPatterns?.edges ?? []).map((n) => n.node);

  const dataColumns = {
    killChainPhase: {
      label: 'Kill chain phase',
      width: '15%',
      isSortable: false,
    },
    x_mitre_id: {
      label: 'ID',
      width: '10%',
      isSortable: true,
    },
    name: {
      label: 'Name',
      width: '30%',
      isSortable: true,
    },
    objectLabel: {
      label: 'Labels',
      width: '20%',
      isSortable: false,
    },
    created: {
      label: 'Original creation date',
      width: '10%',
      isSortable: true,
    },
    modified: {
      label: 'Modification date',
      width: '10%',
      isSortable: true,
    },
  };

  return (
    <AttackPatternsMatrixInLine
      attackPatterns={attackPatterns}
      dataColumns={dataColumns}
      searchTerm={searchTerm}
      handleToggleColorsReversed={handleToggleColorsReversed}
      currentColorsReversed={currentColorsReversed}
      handleAdd={handleAdd}
      marginRight={true}
      hideBar={true}
    />
  );
};

export default StixDomainObjectAttackPatternsKillChainMatrixInline;
