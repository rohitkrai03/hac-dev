import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { mockComponentsData } from '../../components/ApplicationDetails/__data__/WorkflowComponentsData';
import { useComponents } from '../useComponents';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('useComponents', () => {
  it('should return empty array when call is inflight', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false, undefined]);
    const { result } = renderHook(() => useComponents('test-ns', 'test-dev-samples'));
    expect(result.current).toEqual([[], false, undefined]);
  });

  it('should return empty array when the namespace is not passed', () => {
    const { result } = renderHook(() => useComponents(null, 'test-dev-samples'));
    expect(useK8sWatchResourceMock).toHaveBeenCalledWith(null);

    expect(result.current).toEqual([[], false, undefined]);
  });

  it('should return components when namespace is passed', () => {
    useK8sWatchResourceMock.mockReturnValue([mockComponentsData, true, undefined]);

    const { result } = renderHook(() => useComponents('test-ns', 'test-dev-samples'));
    const [components] = result.current;
    expect(components).toHaveLength(3);
  });
});
