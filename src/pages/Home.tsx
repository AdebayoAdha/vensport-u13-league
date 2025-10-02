import { useEffect, useRef, useState } from "react";
import { API } from "../../lib/api";
import { Team, Fixture, NewsStory } from "../../lib/types";

interface HomeProps {
  onNavigate?: (page: string, id?: string) => void;
}

function Home({ onNavigate }: HomeProps) {
  const [text, setText] = useState<string>("");
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const fullText = "Where Legends Are Groomed";
  const indexRef = useRef<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [latestResults, setLatestResults] = useState<Fixture[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [newsSlide, setNewsSlide] = useState<number>(0);
  const [teamSlide, setTeamSlide] = useState<number>(0);
  const [defaultRound, setDefaultRound] = useState<string>("1");
  const [teams, setTeams] = useState<Team[]>([]);

  const [newsStories, setNewsStories] = useState<NewsStory[]>([]);
  const [playerStats, setPlayerStats] = useState<{
    topScorer: { name: string; goals: number } | null;
    topAssist: { name: string; assists: number } | null;
    cleanSheet: { name: string; cleanSheets: number } | null;
  }>({
    topScorer: null,
    topAssist: null,
    cleanSheet: null,
  });
  const [leagueLeader, setLeagueLeader] = useState<{
    teamName: string;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
  } | null>(null);

  useEffect(() => {
    const typeWriter = () => {
      if (indexRef.current < fullText.length) {
        setText(fullText.substring(0, indexRef.current + 1));
        indexRef.current++;
        setTimeout(typeWriter, 100);
      } else {
        setShowSubtitle(true);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setText("");
            setShowSubtitle(false);
            setIsFading(false);
            indexRef.current = 0;
            setTimeout(typeWriter, 500);
          }, 1000);
        }, 2000);
      }
    };

    const timer = setTimeout(() => {
      typeWriter();
    }, 500);

    return () => clearTimeout(timer);
  }, [fullText]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const round = await API.getDefaultRound();
        const fixtures = await API.getFixtures();
        const teamsData = await API.getTeams();
        const newsData = await API.getNews();

        setDefaultRound(round);
        setTeams(teamsData);

        const roundFixtures = fixtures.filter((f) => f.round === parseInt(round));
        const sortedMatches = roundFixtures.sort((a, b) => {
          const aPlayed = a.homeScore !== undefined && a.awayScore !== undefined;
          const bPlayed = b.homeScore !== undefined && b.awayScore !== undefined;
          if (aPlayed && !bPlayed) return -1;
          if (!aPlayed && bPlayed) return 1;
          return 0;
        });
        setLatestResults(sortedMatches);

        if (newsData.length > 0) {
          setNewsStories(newsData.slice(-5).reverse());
        } else {
          const defaultNews: NewsStory[] = [
            {
              image: "/u-13.png",
              date: "Jan 25, 2024",
              title: "Championship Finals Approaching",
              content: "The highly anticipated championship finals are set for this weekend.",
              story: "championship-finals",
            },
          ];
          setNewsStories(defaultNews);
        }

        // Calculate stats
        if (teamsData.length > 0) {
          const teamStats: Record<string, any> = {};
          teamsData.forEach((team) => {
            teamStats[team.teamName] = {
              teamName: team.teamName,
              points: 0,
              goalsFor: 0,
              goalsAgainst: 0,
            };
          });

          fixtures.forEach((fixture) => {
            if (fixture.homeScore !== undefined && fixture.awayScore !== undefined && !fixture.cancelled) {
              const homeTeam = fixture.homeTeam;
              const awayTeam = fixture.awayTeam;
              const homeScore = fixture.homeScore;
              const awayScore = fixture.awayScore;

              if (teamStats[homeTeam] && teamStats[awayTeam]) {
                teamStats[homeTeam].goalsFor += homeScore;
                teamStats[homeTeam].goalsAgainst += awayScore;
                teamStats[awayTeam].goalsFor += awayScore;
                teamStats[awayTeam].goalsAgainst += homeScore;

                if (homeScore > awayScore) {
                  teamStats[homeTeam].points += 3;
                } else if (homeScore < awayScore) {
                  teamStats[awayTeam].points += 3;
                } else {
                  teamStats[homeTeam].points += 1;
                  teamStats[awayTeam].points += 1;
                }
              }
            }
          });

          const topTeam = Object.values(teamStats).sort(
            (a: any, b: any) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
          )[0] as any;
          setLeagueLeader(topTeam);

          // Calculate player stats
          const goalScorers: Record<string, number> = {};
          const assistProviders: Record<string, number> = {};
          const cleanSheetKeepers: Record<string, number> = {};

          fixtures.forEach((fixture) => {
            fixture.homeGoals?.forEach((goal) => {
              if (goal.scorer) goalScorers[goal.scorer] = (goalScorers[goal.scorer] || 0) + 1;
              if (goal.assist) assistProviders[goal.assist] = (assistProviders[goal.assist] || 0) + 1;
            });
            fixture.awayGoals?.forEach((goal) => {
              if (goal.scorer) goalScorers[goal.scorer] = (goalScorers[goal.scorer] || 0) + 1;
              if (goal.assist) assistProviders[goal.assist] = (assistProviders[goal.assist] || 0) + 1;
            });
            if (fixture.homeCleanSheet) cleanSheetKeepers[fixture.homeCleanSheet] = (cleanSheetKeepers[fixture.homeCleanSheet] || 0) + 1;
            if (fixture.awayCleanSheet) cleanSheetKeepers[fixture.awayCleanSheet] = (cleanSheetKeepers[fixture.awayCleanSheet] || 0) + 1;
          });

          const topScorer = Object.entries(goalScorers).sort(([, a], [, b]) => b - a)[0];
          const topAssist = Object.entries(assistProviders).sort(([, a], [, b]) => b - a)[0];
          const topCleanSheet = Object.entries(cleanSheetKeepers).sort(([, a], [, b]) => b - a)[0];

          setPlayerStats({
            topScorer: topScorer ? { name: topScorer[0], goals: topScorer[1] } : null,
            topAssist: topAssist ? { name: topAssist[0], assists: topAssist[1] } : null,
            cleanSheet: topCleanSheet ? { name: topCleanSheet[0], cleanSheets: topCleanSheet[1] } : null,
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (latestResults.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= latestResults.length) {
            setIsTransitioning(false);
            setTimeout(() => {
              setCurrentSlide(0);
              setIsTransitioning(true);
            }, 50);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [latestResults]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">VenSport U-13 League</h1>
          <p className="hero-subtitle">The premier youth football league for under-13 players</p>
          <div className="legend-animation">
            <h1 className={`main-text ${isFading ? "fade-out" : ""}`}>{text}</h1>
            {showSubtitle && <p className="subtitle">Excellence Through Dedication and Discipline</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="home-highlights">
          <div className="combined-content">
            <div className="highlight-card">
              <h3>Round {defaultRound} Matches</h3>
              <div className="slider-container">
                <div className="slider">
                  <div
                    className="slider-track"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
                    }}
                  >
                    {latestResults.length > 0 ? (
                      latestResults.map((result, index) => (
                        <div key={index} className="slide">
                          <div className="match-card">
                            <div className="match-date">{result.date}</div>
                            <div className="match-location">{result.venue || "TBD"}</div>
                            <div className="teams-container">
                              <div className="team home-team">
                                <div className="team-name">{result.homeTeam}</div>
                              </div>
                              <div className="score">
                                {result.homeScore !== undefined ? (
                                  <>
                                    <span className="score-value">{result.homeScore}</span>
                                    <span className="score-separator">:</span>
                                    <span className="score-value">{result.awayScore}</span>
                                    <div className="match-status">FT</div>
                                  </>
                                ) : (
                                  <>
                                    <span className="score-value">vs</span>
                                    <div className="match-status">{result.time}</div>
                                  </>
                                )}
                              </div>
                              <div className="team away-team">
                                <div className="team-name">{result.awayTeam}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="slide">
                        <div className="match-card">
                          <span>No matches available</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="highlight-card">
              <h3>League Leaders</h3>
              <div className="leaders-section">
                <div className="leader-item">
                  <span className="leader-position">League Leader:</span>
                  <span className="leader-points">
                    {leagueLeader ? `${leagueLeader.teamName} (${leagueLeader.points} pts)` : "N/A"}
                  </span>
                </div>
                <div className="leader-item">
                  <span className="leader-position">Goal Scorer:</span>
                  <span className="leader-points">
                    {playerStats.topScorer ? `${playerStats.topScorer.name} (${playerStats.topScorer.goals})` : "N/A"}
                  </span>
                </div>
                <div className="leader-item">
                  <span className="leader-position">Top Assist:</span>
                  <span className="leader-points">
                    {playerStats.topAssist ? `${playerStats.topAssist.name} (${playerStats.topAssist.assists})` : "N/A"}
                  </span>
                </div>
                <div className="leader-item">
                  <span className="leader-position">Clean Sheets:</span>
                  <span className="leader-points">
                    {playerStats.cleanSheet ? `${playerStats.cleanSheet.name} (${playerStats.cleanSheet.cleanSheets})` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="highlight-card">
            <h3>Latest News & Updates</h3>
            <div className="news-slider-container">
              {newsStories[newsSlide] && (
                <div className="news-card" onClick={() => onNavigate && onNavigate('story', newsStories[newsSlide].story)}>
                  <div className="news-image-full">
                    <img src={newsStories[newsSlide].image} alt={newsStories[newsSlide].title} className="news-img-full" />
                  </div>
                  <div className="news-text">
                    <div className="news-date">{newsStories[newsSlide].date}</div>
                    <h4>{newsStories[newsSlide].title}</h4>
                    <p>{newsStories[newsSlide].content?.substring(0, 100)}...</p>
                  </div>
                </div>
              )}
              <div className="news-nav">
                <button
                  className="news-nav-btn prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewsSlide((prev) => (prev === 0 ? newsStories.length - 1 : prev - 1));
                  }}
                >
                  ‹
                </button>
                <button
                  className="news-nav-btn next"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewsSlide((prev) => (prev + 1) % newsStories.length);
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="teams-section">
          <h4>Teams</h4>
          <div className="teams-slider-container">
            <div className="teams-grid">
              {teams.slice(teamSlide * 4, (teamSlide + 1) * 4).map((team, index) => (
                <div key={index} className="team-item">
                  <img src={team.teamLogo || "/u-13.png"} alt={team.teamName} className="team-logo-circle" />
                  <span className="team-name-below">{team.teamName}</span>
                </div>
              ))}
            </div>
          </div>
          {Math.ceil(teams.length / 4) > 1 && (
            <div className="teams-nav">
              <button
                className="teams-nav-btn prev"
                onClick={() => setTeamSlide((prev) => (prev === 0 ? Math.ceil(teams.length / 4) - 1 : prev - 1))}
              >
                ‹
              </button>
              <button
                className="teams-nav-btn next"
                onClick={() => setTeamSlide((prev) => (prev + 1) % Math.ceil(teams.length / 4))}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;