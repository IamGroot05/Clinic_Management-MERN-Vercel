import React from 'react';
import style from './loader.module.css'
function Loader() {
  return (
    <div className={style.loader}>
    <div className={style.circle}></div>
    <div className={style.circle}></div>
    <div className={style.circle}></div>
    <div className={style.circle}></div>
</div>
  )
}

export default Loader
