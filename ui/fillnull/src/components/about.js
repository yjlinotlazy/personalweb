import * as React from 'react';
import TopBar from './top-bar';
import MarkDown from 'react-markdown';
import Container from '@material-ui/core/Container';
import '../App.css';

export const About = () => {
    const text = `中年数据码农对文青属性最后的坚持。\\
    \\
                  小时候用老死机的机器玩了太多游戏， 改不掉无意识频繁存盘的习惯。`
    return (
        <div>
        <TopBar title="关于"/>
        <Container maxWidth="sm" className="main">
        <MarkDown>
        {text}
        </MarkDown>
        </Container>
        </div>
    )
};
