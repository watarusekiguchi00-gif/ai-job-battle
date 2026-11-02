'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { missions, type Mission } from '../lib/missions';
const ROUNDS=5, SECONDS=90, STORAGE='ai-job-battle-best-v1';
type Phase='home'|'playing'|'finished';
function shuffle<T>(xs:T[]):T[]{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export default function Home(){
 const [phase,setPhase]=useState<Phase>('home');
 const [deck,setDeck]=useState<Mission[]>([]);
 const [round,setRound]=useState(0);
 const [seconds,setSeconds]=useState(SECONDS);
 const [answer,setAnswer]=useState<number|null>(null);
 const [score,setScore]=useState(0);
 const [correct,setCorrect]=useState(0);
 const [best,setBest]=useState(0);
 const [history,setHistory]=useState<{title:string;ok:boolean}[]>([]);
 const finishedRef=useRef(false);
 useEffect(()=>{try{setBest(Number(localStorage.getItem(STORAGE)||0));}catch{}},[]);
 const finish=useCallback(()=>{finishedRef.current=true;setPhase('finished');},[]);
 useEffect(()=>{if(phase!=='playing'||answer!==null)return;const id=window.setInterval(()=>setSeconds(s=>{if(s<=1){window.clearInterval(id);finish();return 0;}return s-1;}),1000);return()=>window.clearInterval(id);},[phase,answer,finish]);
 useEffect(()=>{if(phase==='finished'&&score>best){setBest(score);try{localStorage.setItem(STORAGE,String(score));}catch{}}},[phase,score,best]);
 function start(){finishedRef.current=false;setDeck(shuffle(missions).slice(0,ROUNDS));setRound(0);setSeconds(SECONDS);setAnswer(null);setScore(0);setCorrect(0);setHistory([]);setPhase('playing');}
 const mission=deck[round];
 function choose(i:number){if(answer!==null||phase!=='playing'||!mission)return;const ok=i===mission.correct;setAnswer(i);setHistory(h=>[...h,{title:mission.title,ok}]);if(ok){setCorrect(c=>c+1);setScore(s=>s+100+Math.floor(seconds/10)*10);}}
 function next(){if(round+1>=ROUNDS){finish();return;}setRound(r=>r+1);setAnswer(null);}
 const percent=Math.max(0,Math.round(seconds/SECONDS*100));
 return <main className="shell"><header className="top"><div className="brand"><span className="brand-icon">⚡</span><div><strong>AI JOB BATTLE</strong><small>AIのミスを見破れ！</small></div></div><span className="version">v0.1</span></header>
 {phase==='home'&&<section className="panel home"><div className="eyebrow">AI JOB LAB · EXPERIMENT 01</div><div className="hero-icon">🤖 ⚔️ 🧠</div><h1>AIの仕事、<br/><em>本当に信用できる？</em></h1><p className="lead">あなたはAI監督官。AIが作った仕事の中に隠れたミスを見抜け！</p><div className="stats"><div><b>5</b><span>ラウンド</span></div><div><b>90</b><span>秒</span></div><div><b>100+</b><span>正解ポイント</span></div></div><button className="primary" onClick={start}>ゲームスタート <span>→</span></button><div className="rules"><strong>遊び方</strong><p>① AIが作った仕事を読む<br/>② 3つの選択肢からミスを選ぶ<br/>③ 正解とAIの弱点を学ぶ</p></div><p className="fine">登録不要・無料・スマホ対応。問題は事前作成済みです。AI APIは使いません。</p></section>}
 {phase==='playing'&&mission&&<section className="panel play"><div className="hud"><div><span className="muted">ROUND</span><strong>{round+1}<small> / {ROUNDS}</small></strong></div><div className="timer" aria-live="off">⏱ {seconds}s</div><div className="points"><span className="muted">SCORE</span><strong>{score}</strong></div></div><div className="progress" aria-label="残り時間"><div style={{width:`${percent}%`,background:seconds<20?'#ff687a':'#55e1b1'}}/></div><div className="tag">{mission.category}</div><h1>{mission.title}</h1><p className="situation">📋 {mission.situation}</p><div className="ai-output"><div className="ai-label">🤖 AIの仕事</div><p>{mission.output}</p></div><h2>どこが問題？</h2><div className="options">{mission.choices.map((c,i)=><button key={i} className={`option ${answer!==null&&i===mission.correct?'right':''} ${answer===i&&i!==mission.correct?'wrong':''}`} onClick={()=>choose(i)} disabled={answer!==null}><span className="letter">{['A','B','C'][i]}</span><span>{c}</span>{answer!==null&&i===mission.correct&&<span className="mark">✓</span>}</button>)}</div>{answer!==null&&<div className="feedback" role="status"><h3>{answer===mission.correct?'🎉 正解！ AIのミスを発見！':'💡 惜しい！ 正解はこちら'}</h3><p>{mission.explanation}</p><div className="lesson">🧠 {mission.lesson}</div><button className="primary" onClick={next}>{round+1===ROUNDS?'結果を見る':'次のミッションへ'} →</button></div>}</section>}
 {phase==='finished'&&<section className="panel result"><div className="eyebrow">MISSION COMPLETE</div><div className="hero-icon">{correct===ROUNDS?'🏆':correct>=3?'🥇':'🧪'}</div><h1>{correct===ROUNDS?'AI監督官マスター！':correct>=3?'見抜く力がある！':'AIの弱点を学ぼう！'}</h1><p className="lead">AIの仕事は便利。でも確認する力も大切。</p><div className="final-score">{score}<span> POINTS</span></div><div className="stats"><div><b>{correct}/{history.length}</b><span>正解数</span></div><div><b>{SECONDS-seconds}s</b><span>プレイ時間</span></div><div><b>{Math.max(best,score)}</b><span>最高記録</span></div></div><div className="review"><strong>ラウンド結果</strong>{history.map((h,i)=><div key={i}><span>{h.ok?'🟢':'🔴'} {h.title}</span><span>{h.ok?'正解':'不正解'}</span></div>)}</div><button className="primary" onClick={start}>もう一度挑戦 ↻</button><button className="secondary" onClick={()=>setPhase('home')}>タイトルに戻る</button><p className="fine">このゲームの得点は仕事の自動化率やAIの実務能力を保証するものではありません。</p></section>}
 <footer>AI JOB LAB · PLAY → DISCOVER → WORK</footer></main>;
}
