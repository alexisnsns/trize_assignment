import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import ClientDashboard, { Position } from "../app/dashboard/clientDashboard";
import { useWallet } from "../lib/useWallet";

jest.mock("../lib/useWallet");

describe("ClientDashboard", () => {
  // Helper to wrap component in React Query
  const renderWithClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows connect button when wallet is not connected", () => {
    (useWallet as jest.Mock).mockReturnValue({
      address: null,
      connect: jest.fn(),
      disconnect: jest.fn(),
    });

    renderWithClient(<ClientDashboard />);

    // Expect connect button
    const connectButton = screen.getByTestId("connect-button");
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toHaveTextContent("Connect Wallet");

    // Expect reminder text
    expect(
      screen.getByText(
        /please connect your wallet to view your token positions/i
      )
    ).toBeInTheDocument();
  });

  it("disconnect button calls disconnect", () => {
    const mockDisconnect = jest.fn();
    (useWallet as jest.Mock).mockReturnValue({
      address: "0x123",
      connect: jest.fn(),
      disconnect: mockDisconnect,
    });

    renderWithClient(<ClientDashboard />);

    const disconnectBtn = screen.getByTestId("disconnect-button");
    fireEvent.click(disconnectBtn);

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("shows loading skeletons when wallet is connected and data is loading", () => {
    (useWallet as jest.Mock).mockReturnValue({
      address: "0x123",
      connect: jest.fn(),
      disconnect: jest.fn(),
    });

    renderWithClient(<ClientDashboard />);

    // Skeletons are present
    const skeletons = screen.getAllByRole("progressbar");
    expect(skeletons.length).toBeGreaterThan(0);

    // Refresh button exists but disabled during loading
    const refreshBtn = screen.getByRole("button", { name: /refresh data/i });
    expect(refreshBtn).toBeDisabled();
  });
});
