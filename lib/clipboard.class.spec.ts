import { ClipboardClass } from "./clipboard.class";
import { ProviderRegistry } from "./provider/provider-registry.class";
import { mockPartial } from "sneer";
import { ClipboardProviderInterface } from "./provider";
import { NoopLogProvider } from "./provider/log/noop-log-provider.class";

jest.mock("jimp", () => {});

beforeEach(() => {
  jest.clearAllMocks();
});

const providerRegistryMock = mockPartial<ProviderRegistry>({});

describe("Clipboard class", () => {
  it("should call providers copy method.", () => {
    // GIVEN
    const SUT = new ClipboardClass(providerRegistryMock);
    const copyMock = jest.fn();
    providerRegistryMock.getClipboard = jest.fn(() =>
      mockPartial<ClipboardProviderInterface>({
        copy: copyMock,
      })
    );
    providerRegistryMock.getLogProvider = () => new NoopLogProvider();
    const textToCopy = "bar";

    // WHEN
    SUT.setContent(textToCopy);

    // THEN
    expect(copyMock).toHaveBeenCalledTimes(1);
    expect(copyMock).toHaveBeenCalledWith(textToCopy);
  });

  it("should call providers paste method.", () => {
    // GIVEN
    const SUT = new ClipboardClass(providerRegistryMock);
    const pasteMock = jest.fn();
    providerRegistryMock.getClipboard = jest.fn(() =>
      mockPartial<ClipboardProviderInterface>({
        paste: pasteMock,
      })
    );
    providerRegistryMock.getLogProvider = () => new NoopLogProvider();

    // WHEN
    SUT.getContent();

    // THEN
    expect(pasteMock).toHaveBeenCalledTimes(1);
  });
});
