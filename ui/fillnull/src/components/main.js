import * as React from 'react';
import TopBar from './top-bar';
import MarkDown from 'react-markdown';
import Container from '@material-ui/core/Container';
import '../App.css';

export const Main = () => {
    const text = `热门游戏一起玩，二话不说存个盘\\
    日常怀旧心态好，顿顿冷饭吃到老\\
    误入头像收藏坑，阴阳师里荷包疼\\
    千金呱呱一魅笑，立马弃游陪娃闹
    `
    return (
        <div>
        <TopBar title="存盘强迫症"/>
        <Container maxWidth="sm" className="main">
        <MarkDown>
        {text}
        </MarkDown>
        </Container>
        </div>
    )
};
