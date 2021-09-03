import * as React from 'react';
import TopBar from './top-bar';
import MarkDown from 'react-markdown';
import Container from '@material-ui/core/Container';
import '../App.css';

export const About = () => {
    const text = `尚未放弃文青属性的中年数据码农，虽为五斗米折腰，但时不时偷闲捣鼓些精神食粮。\\
    \\
                  小时候用老死机的机器玩了太多游戏， 养成了改不掉的无意识频繁存盘的习惯。\\
                  \\
                  此个人网站曾经作为成长记录，现在用来督促自己做个有趣的灵魂，不要成为一
                  个天天只知道吃薯片喝快乐水打游戏的肥宅， 给闺女做个好榜样。同时，也算
                  是码工对文青属性最后的坚持。`
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
