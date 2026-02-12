// src/__tests__/rooms-epic6-components.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SyncModeSelector } from '../components/rooms/SyncModeSelector';
import { SkinLineSynergyCard } from '../components/rooms/SkinLineSynergyCard';
import { SynergiesPanel } from '../components/rooms/SynergiesPanel';
import { CombinationBuilder } from '../components/rooms/CombinationBuilder';
import type { SkinLineSynergy, RoomState, RoomMember } from '../features/roomsClient';

// --- Helpers ---

function makeSynergy(overrides: Partial<SkinLineSynergy> = {}): SkinLineSynergy {
  return {
    type: 'skinLine',
    skinLineId: 10,
    skinLineName: 'Star Guardian',
    members: ['m1', 'm2'],
    coverage: 1,
    combinationCount: 2,
    ...overrides,
  };
}

function makeMembers(count: number): RoomMember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `m${i + 1}`,
    name: `Player${i + 1}`,
    championId: 100 + i,
    championAlias: `Champ${i + 1}`,
    skinId: 1000 + i,
    chromaId: 0,
  }));
}

function makeRoom(overrides: Partial<RoomState> = {}): RoomState {
  const members = makeMembers(2);
  return {
    id: 'room-1',
    code: 'ABC123',
    ownerId: 'm1',
    members,
    synergy: {
      colors: [],
      skinLines: [makeSynergy({ members: members.map((m) => m.id) })],
    },
    syncMode: 'both',
    ...overrides,
  };
}

// --- SyncModeSelector ---

describe('SyncModeSelector', () => {
  it('should render all 3 mode buttons', () => {
    render(
      <SyncModeSelector currentMode="both" isOwner={true} onChange={() => {}} />
    );

    expect(screen.getByText('Chromas')).toBeInTheDocument();
    expect(screen.getByText('Skins')).toBeInTheDocument();
    expect(screen.getByText('Both')).toBeInTheDocument();
  });

  it('should highlight the active mode', () => {
    render(
      <SyncModeSelector currentMode="skins" isOwner={true} onChange={() => {}} />
    );

    const skinsBtn = screen.getByText('Skins');
    expect(skinsBtn.className).toContain('active');
  });

  it('should call onChange when owner clicks a mode', () => {
    const onChange = vi.fn();
    render(
      <SyncModeSelector currentMode="both" isOwner={true} onChange={onChange} />
    );

    fireEvent.click(screen.getByText('Skins'));
    expect(onChange).toHaveBeenCalledWith('skins');
  });

  it('should not call onChange when non-owner clicks', () => {
    const onChange = vi.fn();
    render(
      <SyncModeSelector currentMode="both" isOwner={false} onChange={onChange} />
    );

    fireEvent.click(screen.getByText('Skins'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should disable buttons for non-owner', () => {
    render(
      <SyncModeSelector currentMode="both" isOwner={false} onChange={() => {}} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

// --- SkinLineSynergyCard ---

describe('SkinLineSynergyCard', () => {
  const members = makeMembers(3);
  const synergy = makeSynergy({
    members: ['m1', 'm2'],
    combinationCount: 4,
  });

  it('should render skin line name and stats', () => {
    render(
      <SkinLineSynergyCard
        synergy={synergy}
        isOwner={false}
        onClick={() => {}}
        members={members}
        index={0}
      />
    );

    expect(screen.getByText('Star Guardian')).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument(); // coverage
    expect(screen.getByText('4 combos')).toBeInTheDocument();
  });

  it('should show "1 combo" singular', () => {
    const singleCombo = makeSynergy({ combinationCount: 1 });
    render(
      <SkinLineSynergyCard
        synergy={singleCombo}
        isOwner={false}
        onClick={() => {}}
        members={members}
        index={0}
      />
    );

    expect(screen.getByText('1 combo')).toBeInTheDocument();
  });

  it('should show Apply hint for owner', () => {
    render(
      <SkinLineSynergyCard
        synergy={synergy}
        isOwner={true}
        onClick={() => {}}
        members={members}
        index={0}
      />
    );

    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('should not show Apply hint for non-owner', () => {
    render(
      <SkinLineSynergyCard
        synergy={synergy}
        isOwner={false}
        onClick={() => {}}
        members={members}
        index={0}
      />
    );

    expect(screen.queryByText('Apply')).toBeNull();
  });

  it('should call onClick when owner clicks', () => {
    const onClick = vi.fn();
    render(
      <SkinLineSynergyCard
        synergy={synergy}
        isOwner={true}
        onClick={onClick}
        members={members}
        index={0}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when non-owner clicks', () => {
    const onClick = vi.fn();
    render(
      <SkinLineSynergyCard
        synergy={synergy}
        isOwner={false}
        onClick={onClick}
        members={members}
        index={0}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// --- SynergiesPanel ---

describe('SynergiesPanel', () => {
  it('should render skin line synergies', () => {
    const room = makeRoom();
    render(
      <SynergiesPanel
        room={room}
        isOwner={true}
        onApplySkinLine={() => {}}
      />
    );

    expect(screen.getByText('Skin Lines')).toBeInTheDocument();
    expect(screen.getByText('Star Guardian')).toBeInTheDocument();
  });

  it('should render count badge', () => {
    const room = makeRoom();
    render(
      <SynergiesPanel
        room={room}
        isOwner={true}
        onApplySkinLine={() => {}}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // count badge
  });

  it('should return null when no skin line synergies', () => {
    const room = makeRoom({
      synergy: { colors: [], skinLines: [] },
    });
    const { container } = render(
      <SynergiesPanel
        room={room}
        isOwner={true}
        onApplySkinLine={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should call onApplySkinLine with skinLineId when card is clicked by owner', () => {
    const onApply = vi.fn();
    const room = makeRoom();
    render(
      <SynergiesPanel
        room={room}
        isOwner={true}
        onApplySkinLine={onApply}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));
    expect(onApply).toHaveBeenCalledWith(10);
  });
});

// --- CombinationBuilder ---

describe('CombinationBuilder', () => {
  it('should not render when isOpen is false', () => {
    const room = makeRoom();
    const { container } = render(
      <CombinationBuilder
        room={room}
        isOpen={false}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render modal when isOpen is true', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Build Combination')).toBeInTheDocument();
    expect(screen.getByText('1. Choose Synergy')).toBeInTheDocument();
  });

  it('should show skin line synergies in step 1', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Skin Lines')).toBeInTheDocument();
    expect(screen.getByText('Star Guardian')).toBeInTheDocument();
  });

  it('should show empty message when no synergies', () => {
    const room = makeRoom({
      synergy: { colors: [], skinLines: [] },
    });
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText(/no synergies available/i)).toBeInTheDocument();
  });

  it('should show step 2 after selecting a synergy', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));

    expect(screen.getByText('2. Fine-tune (optional)')).toBeInTheDocument();
    expect(screen.getByText('3. Preview')).toBeInTheDocument();
  });

  it('should have Apply button disabled initially', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    const applyBtn = screen.getByText('Apply');
    expect(applyBtn).toBeDisabled();
  });

  it('should enable Apply after selecting a synergy (all members get picks)', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));

    const applyBtn = screen.getByText('Apply');
    expect(applyBtn).not.toBeDisabled();
  });

  it('should call onApply and onClose when Apply is clicked', () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={onClose}
        onApply={onApply}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));
    fireEvent.click(screen.getByText('Apply'));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Verify picks format
    const picks = onApply.mock.calls[0][0];
    expect(picks).toHaveLength(2);
    expect(picks[0]).toHaveProperty('memberId');
    expect(picks[0]).toHaveProperty('skinId');
    expect(picks[0]).toHaveProperty('chromaId');
  });

  it('should reset state when Reset is clicked', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    // Select a synergy
    fireEvent.click(screen.getByText('Star Guardian'));
    expect(screen.getByText('2. Fine-tune (optional)')).toBeInTheDocument();

    // Click reset
    fireEvent.click(screen.getByText('Reset'));

    // Step 2 should no longer be visible
    expect(screen.queryByText('2. Fine-tune (optional)')).toBeNull();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={onClose}
        onApply={() => {}}
      />
    );

    // The close button has × character
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render footer buttons', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Randomize')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('should disable Randomize when no synergy selected', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Randomize')).toBeDisabled();
  });

  it('should enable Randomize after selecting a synergy', () => {
    const room = makeRoom();
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Star Guardian'));
    expect(screen.getByText('Randomize')).not.toBeDisabled();
  });

  it('should show color synergies when available', () => {
    const room = makeRoom({
      synergy: {
        skinLines: [],
        colors: [
          {
            type: 'sameColor',
            color: 'Blue',
            members: ['m1', 'm2'],
            coverage: 1,
            combinationCount: 3,
          },
        ],
      },
    });
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('should select a color synergy and show step 2', () => {
    const room = makeRoom({
      synergy: {
        skinLines: [],
        colors: [
          {
            type: 'sameColor',
            color: 'Blue',
            members: ['m1', 'm2'],
            coverage: 1,
            combinationCount: 3,
          },
        ],
      },
    });
    render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={() => {}}
        onApply={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Blue'));

    expect(screen.getByText('2. Fine-tune (optional)')).toBeInTheDocument();
    expect(screen.getByText('3. Preview')).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const room = makeRoom();
    const { container } = render(
      <CombinationBuilder
        room={room}
        isOpen={true}
        onClose={onClose}
        onApply={() => {}}
      />
    );

    // Click the overlay (first child)
    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
