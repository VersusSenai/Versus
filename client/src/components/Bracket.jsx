import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../api';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Zap } from 'lucide-react';

const horizontalSpacing = 240;
const boxWidth = 200;
const boxHeight = 64;
const verticalSpacing = 18;

export default function ProfessionalBracket({ eventId, multiplayer }) {
  const [rounds, setRounds] = useState([]);
  const containerRef = useRef(null);
  const matchesRefs = useRef({});
  const [positions, setPositions] = useState({});
  const [lines, setLines] = useState([]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const onMouseDown = useCallback((e) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    startY.current = e.pageY - containerRef.current.offsetTop;
    scrollLeft.current = containerRef.current.scrollLeft;
    scrollTop.current = containerRef.current.scrollTop;
    containerRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
  }, []);

  const onMouseUp = useCallback(() => {
    if (!containerRef.current) return;
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX.current) * 1.5;
    const walkY = (y - startY.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walkX;
    containerRef.current.scrollTop = scrollTop.current - walkY;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.cursor = 'grab';

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseleave', onMouseLeave);
    container.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseDown, onMouseLeave, onMouseUp, onMouseMove]);

  const declareWinner = async (matchId, winnerId) => {
    const match = rounds.flatMap((r) => r.matches).find((m) => m.id === matchId);
    if (!match) {
      alert('Partida não encontrada.');
      return;
    }
    if (!match.teams[0].id || !match.teams[1].id) {
      alert('Partida incompleta. Não é possível declarar vencedor.');
      return;
    }

    try {
      await api.post(`/event/winner/${matchId}`, { winnerId });

      const resUpdated = await api.get(`/event/${eventId}/match`);
      const matches = resUpdated.data;

      const grouped = matches.reduce((acc, match) => {
        if (!acc[match.keyNumber]) acc[match.keyNumber] = [];
        acc[match.keyNumber].push(match);
        return acc;
      }, {});

      const roundNumbers = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

      const roundsData = roundNumbers.map((roundNum) => {
        const matchesInRound = grouped[roundNum]
          ? grouped[roundNum]
              .sort((a, b) => a.matchNumber - b.matchNumber)
              .map((match) => ({
                id: match.id,
                winnerId: match.winnerId,
                teams: [
                  {
                    id: multiplayer ? match.firstTeam?.id : match.firstUser?.id,
                    name: multiplayer ? match.firstTeam?.name : match.firstUser?.username || 'TBD',
                  },
                  {
                    id: multiplayer ? match.secondTeam?.id : match.secondUser?.id,
                    name: multiplayer
                      ? match.secondTeam?.name
                      : match.secondUser?.username || 'TBD',
                  },
                ],
              }))
          : [];

        return { round: roundNum, matches: matchesInRound };
      });

      setRounds(roundsData);
    } catch (error) {
      console.error('Erro ao declarar vencedor:', error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message ||
        'Erro desconhecido ao declarar vencedor.';
      alert(`Erro ao declarar vencedor:\n\n${message}`);
    }
  };

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await api.get(`/event/${eventId}/match`);
        const matches = res.data;

        const grouped = matches.reduce((acc, match) => {
          if (!acc[match.keyNumber]) acc[match.keyNumber] = [];
          acc[match.keyNumber].push(match);
          return acc;
        }, {});

        const roundNumbers = Object.keys(grouped)
          .map(Number)
          .sort((a, b) => a - b);

        const roundsData = roundNumbers.map((roundNum) => {
          const matchesInRound = grouped[roundNum]
            ? grouped[roundNum]
                .sort((a, b) => a.matchNumber - b.matchNumber)
                .map((match) => ({
                  id: match.id,
                  winnerId: match.winnerId,
                  teams: [
                    {
                      id: multiplayer ? match.firstTeam?.id : match.firstUser?.id,
                      name: multiplayer ? match.firstTeam?.name : match.firstUser?.username || '—',
                    },
                    {
                      id: multiplayer ? match.secondTeam?.id : match.secondUser?.id,
                      name: multiplayer
                        ? match.secondTeam?.name
                        : match.secondUser?.username || '—',
                    },
                  ],
                }))
            : [];

          return { round: roundNum, matches: matchesInRound };
        });

        setRounds(roundsData);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      }
    }
    fetchMatches();
  }, [eventId, multiplayer]);

  useEffect(() => {
    const refsObj = {};
    rounds.forEach((round, i) => {
      refsObj[i] = (round.matches || []).map(() => React.createRef());
    });
    matchesRefs.current = refsObj;
  }, [rounds]);

  const calculatePositions = () => {
    if (!rounds.length) return;

    const firstRoundPositions = rounds[0].matches.map(
      (_, idx) => idx * (boxHeight + verticalSpacing)
    );

    const newPositions = { 0: firstRoundPositions };

    for (let r = 1; r < rounds.length; r++) {
      newPositions[r] = [];

      for (let m = 0; m < rounds[r].matches.length; m++) {
        const child1Index = m * 2;
        const child2Index = child1Index + 1;

        const prevRoundPositions = newPositions[r - 1] || [];

        const child1Pos = prevRoundPositions[child1Index];
        const child2Pos = prevRoundPositions[child2Index];

        let pos = 0;

        if (child1Pos !== undefined && child2Pos !== undefined) {
          pos = (child1Pos + child2Pos) / 2;
        } else if (child1Pos !== undefined) {
          pos = child1Pos;
        } else if (child2Pos !== undefined) {
          pos = child2Pos;
        } else {
          // fallback caso ambos undefined: usa posição abaixo do último calculado ou 0
          pos =
            newPositions[r].length > 0
              ? newPositions[r][newPositions[r].length - 1] + boxHeight + verticalSpacing
              : 0;
        }

        newPositions[r][m] = pos;
      }
    }

    setPositions(newPositions);
  };

  const calculateLines = () => {
    if (!rounds.length || !Object.keys(positions).length) return;

    const newLines = [];

    for (let r = 0; r < rounds.length - 1; r++) {
      for (let m = 0; m < rounds[r + 1].matches.length; m++) {
        const offset = (horizontalSpacing - boxWidth) / 2;
        const startX = r * horizontalSpacing + offset + boxWidth;
        const endX = (r + 1) * horizontalSpacing + offset;

        const child1Index = m * 2;
        const child2Index = child1Index + 1;

        const startY1 = positions[r][child1Index] + boxHeight / 2;
        const startY2 = positions[r][child2Index] + boxHeight / 2;
        const endY = positions[r + 1][m] + boxHeight / 2;

        newLines.push({
          d: `M${startX},${startY1} C${startX + 60},${startY1} ${endX - 60},${endY} ${endX},${endY}`,
        });
        newLines.push({
          d: `M${startX},${startY2} C${startX + 60},${startY2} ${endX - 60},${endY} ${endX},${endY}`,
        });
        newLines.push({
          d: `M${endX},${endY} l8,-6 l0,12 Z`,
          isArrow: true,
          points: [
            [endX, endY],
            [endX - 8, endY - 6],
            [endX - 8, endY + 6],
          ],
        });
      }
    }

    setLines(newLines);
  };

  useEffect(() => {
    calculatePositions();
  }, [rounds]);

  useEffect(() => {
    calculateLines();
  }, [positions]);

  // Componente MatchBox moderno e compacto
  const MatchBox = React.forwardRef(
    ({ team1, team2, winnerId, style, onDeclareWinner, isLastRound }, ref) => {
      const isMatchComplete = team1.id && team2.id;
      const isTeam1Winner = team1.id === winnerId;
      const isTeam2Winner = team2.id === winnerId;

      const handleDeclareWinner = (teamId) => {
        if (!isMatchComplete) {
          alert('Partida incompleta. Não é possível declarar vencedor.');
          return;
        }
        onDeclareWinner(teamId);
      };

      return (
        <div
          ref={ref}
          style={{
            position: 'absolute',
            width: boxWidth,
            ...style,
          }}
          className="select-none"
        >
          <div className="bg-[var(--color-dark)]/80 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden hover:border-[var(--color-1)]/70 transition-all">
            {/* Team 1 */}
            <div
              className={`flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 ${
                isTeam1Winner
                  ? 'bg-gradient-to-r from-[var(--color-1)]/30 to-transparent'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {isTeam1Winner && <Crown className="text-yellow-400 flex-shrink-0" size={13} />}
                <span
                  className={`truncate text-xs ${isTeam1Winner ? 'font-bold text-white' : 'text-white/70'}`}
                >
                  {team1.name || 'TBD'}
                </span>
              </div>
              {winnerId == null && isMatchComplete && (
                <Button
                  onClick={() => handleDeclareWinner(team1.id)}
                  size="sm"
                  className="ml-1.5 h-5 w-5 p-0 text-xs bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90"
                >
                  <Zap size={11} />
                </Button>
              )}
            </div>

            {/* Team 2 */}
            <div
              className={`flex items-center justify-between px-2.5 py-1.5 ${
                isTeam2Winner
                  ? 'bg-gradient-to-r from-[var(--color-1)]/30 to-transparent'
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {isTeam2Winner && <Crown className="text-yellow-400 flex-shrink-0" size={13} />}
                <span
                  className={`truncate text-xs ${isTeam2Winner ? 'font-bold text-white' : 'text-white/70'}`}
                >
                  {team2.name || 'TBD'}
                </span>
              </div>
              {winnerId == null && isMatchComplete && (
                <Button
                  onClick={() => handleDeclareWinner(team2.id)}
                  size="sm"
                  className="ml-1.5 h-5 w-5 p-0 text-xs bg-gradient-to-r from-[var(--color-1)] to-[var(--color-2)] hover:opacity-90"
                >
                  <Zap size={11} />
                </Button>
              )}
            </div>

            {/* Winner Badge for Finals */}
            {isLastRound && (isTeam1Winner || isTeam2Winner) && (
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-2 py-0.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Trophy size={11} />
                  <span className="text-[10px] font-bold text-white">CAMPEÃO</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: 16,
        borderRadius: 12,
        maxWidth: '100%',
        height: '100%',
        overflow: 'auto',
        whiteSpace: 'nowrap',
        cursor: 'grab',
      }}
      className="bg-[#0a0118]/30 backdrop-blur-sm"
    >
      <div style={{ position: 'relative', display: 'inline-block', minHeight: '280px' }}>
        {/* Round Headers */}
        <div style={{ display: 'flex', marginBottom: 12, gap: 6 }}>
          {rounds.map((round, idx) => (
            <div
              key={round.round}
              style={{
                width: horizontalSpacing,
                textAlign: 'center',
                paddingLeft: (horizontalSpacing - boxWidth) / 2,
                paddingRight: (horizontalSpacing - boxWidth) / 2,
              }}
              className="select-none"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-[var(--color-1)]/20 to-[var(--color-2)]/20 border border-[var(--color-1)]/30">
                {idx === rounds.length - 1 ? (
                  <>
                    <Trophy className="text-yellow-400" size={14} />
                    <span className="font-bold text-white text-xs">Final</span>
                  </>
                ) : (
                  <span className="font-bold text-white text-xs">Round {round.round}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Matches Area */}
        <div
          style={{
            position: 'relative',
            height: Math.max(280, (rounds[0]?.matches.length || 1) * (boxHeight + verticalSpacing)),
            minWidth: rounds.length * horizontalSpacing,
          }}
        >
          {rounds.map((round, rIdx) => (
            <div
              key={round.round}
              style={{
                position: 'absolute',
                left: rIdx * horizontalSpacing + (horizontalSpacing - boxWidth) / 2,
                top: 0,
              }}
            >
              {round.matches.map((match, mIdx) => {
                const top = positions[rIdx]?.[mIdx] ?? 0;
                return (
                  <MatchBox
                    key={match.id}
                    ref={matchesRefs.current[rIdx]?.[mIdx] || null}
                    team1={match.teams[0]}
                    team2={match.teams[1]}
                    winnerId={match.winnerId}
                    style={{ top }}
                    onDeclareWinner={(winnerId) => declareWinner(match.id, winnerId)}
                    isLastRound={rIdx === rounds.length - 1}
                  />
                );
              })}
            </div>
          ))}

          {/* Connection Lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              overflow: 'visible',
              width: '100%',
              height: '100%',
            }}
          >
            {lines.map((line, i) =>
              line.isArrow ? (
                <polygon
                  key={i}
                  points={line.points.map((p) => p.join(',')).join(' ')}
                  fill="var(--color-1)"
                  opacity={0.5}
                />
              ) : (
                <path
                  key={i}
                  d={line.d}
                  stroke="var(--color-1)"
                  strokeWidth={2}
                  fill="none"
                  opacity={0.3}
                />
              )
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
