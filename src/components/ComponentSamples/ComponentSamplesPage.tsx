import * as React from 'react';
import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { FormFooter } from '../../shared';
import CatalogView from '../../shared/components/catalog/catalog-view/CatalogView';
import CatalogTile from '../../shared/components/catalog/CatalogTile';
import { CatalogItem } from '../../shared/components/catalog/utils/types';
import { getDevfileSamples } from '../../utils/devfile-utils';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';

export const ComponentSamplesPage = () => {
  const { handleNext, handleBack, handleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const [selected, setSelected] = React.useState<CatalogItem>();
  const [items, setItems] = React.useState<CatalogItem[]>([]);

  React.useEffect(() => {
    if (formState.component) {
      setSelected(formState.component);
    }
    // We just need setSelected called once when the component is mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const fetchDevfileSamples = async () => {
      const devfileSamples = await getDevfileSamples();

      if (devfileSamples) {
        setItems(devfileSamples);
      }
    };

    fetchDevfileSamples();
  }, []);

  const handleSubmit = React.useCallback(() => {
    setValues((prevValues) => ({ ...prevValues, component: selected }));
    handleNext();
  }, [selected, setValues, handleNext]);

  const renderTile = React.useCallback(
    (item: CatalogItem) => (
      <CatalogTile
        item={item}
        featured={item.name === selected?.name}
        onClick={() =>
          setSelected((prevState) =>
            prevState ? (prevState.name !== item.name ? item : undefined) : item,
          )
        }
      />
    ),
    [selected],
  );

  const drawerPanelContent = selected ? (
    <DrawerPanelContent>
      <DrawerHead>
        <DrawerActions>
          <DrawerCloseButton onClick={() => setSelected(undefined)} />
        </DrawerActions>
      </DrawerHead>
      <Flex style={{ padding: '0 var(--pf-global--spacer--md)' }} direction={{ default: 'column' }}>
        <FlexItem>
          <img style={{ height: '130px' }} src={selected.icon.url} alt={selected.name} />
        </FlexItem>
        <FlexItem>
          <LabelGroup>
            {selected.tags.map((label) => (
              <Label key={label}>{label}</Label>
            ))}
          </LabelGroup>
        </FlexItem>
        <FlexItem>
          <b>Project type:</b> {selected.attributes.projectType}
        </FlexItem>
        <FlexItem>
          <b>Language:</b> {selected.attributes.language}
        </FlexItem>
        <FlexItem>
          <a href={selected.attributes.git.remotes.origin} target="_blank" rel="noreferrer">
            View Git Repository
          </a>
        </FlexItem>
        <FlexItem>
          <Title headingLevel="h2" size="3xl">
            {selected.name}
          </Title>
        </FlexItem>
        <FlexItem>
          <Text component={TextVariants.p}>{selected.description}</Text>
        </FlexItem>
      </Flex>
    </DrawerPanelContent>
  ) : null;

  return (
    <Drawer isExpanded={!!selected} isInline>
      <DrawerContent panelContent={drawerPanelContent}>
        <DrawerContentBody>
          <Page
            breadcrumbs={[
              { path: '#', name: 'Applications' },
              { path: '#', name: 'Create your application' },
            ]}
            heading="Start with a sample"
            description="Get started using applications by choosing a code sample"
          >
            <CatalogView items={items} renderTile={renderTile} hideSidebar={true} />
            <FormFooter
              submitLabel="Next"
              resetLabel="Back"
              isSubmitting={false}
              disableSubmit={!selected}
              errorMessage={undefined}
              handleSubmit={handleSubmit}
              handleReset={handleBack}
              handleCancel={() => {
                handleReset();
                setValues({});
              }}
            />
          </Page>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
