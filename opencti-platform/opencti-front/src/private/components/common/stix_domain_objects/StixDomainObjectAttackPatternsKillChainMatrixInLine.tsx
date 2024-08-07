import React, { FunctionComponent } from 'react';
import { TargetEntity } from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import {
  StixDomainObjectAttackPatternsKillChainContainer_data$data,
} from '@components/common/stix_domain_objects/__generated__/StixDomainObjectAttackPatternsKillChainContainer_data.graphql';
import AttackPatternsMatrixLines from '@components/techniques/attack_patterns/AttackPatternsMatrixLines';
import { NarrativesLinesPaginationQuery$variables } from '@components/techniques/narratives/__generated__/NarrativesLinesPaginationQuery.graphql';
import useEntityToggle from '../../../../utils/hooks/useEntityToggle';
import ListLines from '../../../../components/list_lines/ListLines';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { emptyFilterGroup } from '../../../../utils/filters/filtersUtils';

const LOCAL_STORAGE_KEY = 'StixDomainObjectAttackPatternsKillChainMatrixInline';

interface StixDomainObjectAttackPatternsKillChainMatrixProps {
  searchTerm: string;
  data: StixDomainObjectAttackPatternsKillChainContainer_data$data;
  handleAdd: (entity: TargetEntity) => void;
}
const StixDomainObjectAttackPatternsKillChainMatrixInline: FunctionComponent<StixDomainObjectAttackPatternsKillChainMatrixProps> = (
  {
    searchTerm,
    data,
    handleAdd,
  },
) => {
  const { viewStorage, helpers } = usePaginationLocalStorage<NarrativesLinesPaginationQuery$variables>(
    LOCAL_STORAGE_KEY,
    {
      searchTerm: '',
      sortBy: 'name',
      orderAsc: true,
      openExports: false,
      filters: {
        ...emptyFilterGroup,
      },
      view: 'lines',
    },
  );
  const {
    sortBy,
    orderAsc,
    numberOfElements,
  } = viewStorage;
  const attackPatterns = (data.attackPatterns?.edges ?? []).map((n) => n.node);

  const {
    onToggleEntity,
    numberOfSelectedElements,
    handleClearSelectedElements,
    selectedElements,
    deSelectedElements,
    selectAll,
    handleToggleSelectAll,
  } = useEntityToggle('Attack-Pattern');

  const dataColumns = {
    killChainPhase: {
      label: 'Kill chain phase',
      width: '25%',
      isSortable: false,
    },
    x_mitre_id: {
      label: 'ID',
      width: '10%',
      isSortable: true,
    },
    name: {
      label: 'Name',
      width: '15%',
      isSortable: true,
    },
    objectLabel: {
      label: 'Labels',
      width: '15%',
      isSortable: false,
    },
    created: {
      label: 'Original creation date',
      width: '20%',
      isSortable: true,
    },
    objectMarking: {
      label: 'Marking',
      width: '15%',
      isSortable: true,
    },
  };

  return (
    <>
      <ListLines
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleToggleSelectAll={handleToggleSelectAll}
        selectAll={selectAll}
        numberOfElements={numberOfElements}
        iconExtension={true}
      >
        <AttackPatternsMatrixLines
          attackPatterns={attackPatterns}
          dataColumns={dataColumns}
          searchTerm={searchTerm}
          handleAdd={handleAdd}
          onToggleEntity={onToggleEntity}
          numberOfSelectedElements={numberOfSelectedElements}
          handleClearSelectedElements={handleClearSelectedElements}
          selectedElements={selectedElements}
          deSelectedElements={deSelectedElements}
          selectAll={selectAll}
          handleToggleSelectAll={handleToggleSelectAll}
        />
      </ListLines>
    </>

  );
};

export default StixDomainObjectAttackPatternsKillChainMatrixInline;
