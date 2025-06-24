import React, { useEffect, useState, useRef } from 'react';
import api from '../api';

const horizontalSpacing = 350;
const boxWidth = 250;
const boxHeight = 64;
const verticalSpacing = 44;

const MatchBox = React.forwardRef(({ team1, team2, winnerId, style }, ref) => {
  const winnerStyle = (teamId) => (teamId === winnerId ? { fontWeight: 'bold' } : {});

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        width: boxWidth,
        padding: '6px 10px',
        border: '1px solid #ccc',
        backgroundColor: '#fafafa',
        borderRadius: 4,
        userSelect: 'none',
        ...style,
      }}
    >
      <div style={{ ...winnerStyle(team1.id), marginBottom: 6 }}>{team1.name || '—'}</div>
      <div style={winnerStyle(team2.id)}>{team2.name || '—'}</div>
    </div>
  );
});

export default function ProfessionalBracket({ eventId, multiplayer }) {
  const [rounds, setRounds] = useState([]);
  const containerRef = useRef(null);
  const matchesRefs = useRef({});
  const [positions, setPositions] = useState({});
  const [lines, setLines] = useState([]);

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

          return {
            round: roundNum,
            matches: matchesInRound,
          };
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

        const child1Pos = newPositions[r - 1][child1Index];
        const child2Pos = newPositions[r - 1][child2Index];

        const pos =
          child1Pos !== undefined && child2Pos !== undefined
            ? (child1Pos + child2Pos) / 2
            : child1Pos !== undefined
              ? child1Pos
              : 0;

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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        minHeight: (rounds[0]?.matches.length || 1) * (boxHeight + verticalSpacing) + 70,
      }}
    >
      {/* Títulos dos rounds */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          display: 'flex',
          paddingBottom: 16,
          backgroundColor: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
          zIndex: 10,
          userSelect: 'none',
          borderBottom: '1px solid #ddd',
          marginBottom: 12,
        }}
      >
        {rounds.map((round, rIdx) => (
          <div
            key={round.round}
            style={{
              width: horizontalSpacing,
              textAlign: 'center',
              paddingLeft: (horizontalSpacing - boxWidth) / 2,
              paddingRight: (horizontalSpacing - boxWidth) / 2,
              boxSizing: 'border-box',
            }}
          >
            Round {round.round}
          </div>
        ))}
      </div>

      {/* Blocos das partidas */}
      <div
        style={{
          position: 'relative',
          height: (rounds[0]?.matches.length || 1) * (boxHeight + verticalSpacing),
          minWidth: rounds.length * horizontalSpacing,
          userSelect: 'none',
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
                />
              );
            })}
          </div>
        ))}

        {/* Linhas SVG */}
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
                fill="#4B5563"
              />
            ) : (
              <path key={i} d={line.d} stroke="#4B5563" strokeWidth={2} fill="none" />
            )
          )}
        </svg>
      </div>
    </div>
  );
}
