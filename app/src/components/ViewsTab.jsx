import { Badge, Tabs } from "antd"
import { useAppData } from "@/contexts/AppContext"

export const ViewsTab = () => {
    const { tab, setTab, terminalNotification } = useAppData(); 
    
    const items = [
        {
            key: 'terminal',
            label: <><Badge dot={terminalNotification}>Terminal</Badge></>,
        },
        {
            key: 'lexicalSymbols',
            label: 'Símbolos Léxicos',
        },
        {
            key: 'syntaxTree',
            label: 'Árvore Sintática',
        },
        {
            key: 'derivationTree',
            label: 'Árvore de Derivação',
        },
        {
            key: 'mvs',
            label: 'MVS Passo a passo'
        },
        {
            key: 'symbols',
            label: 'Tabela de Símbolos'
        }
    ]

    return <Tabs items={items} activeKey={tab} onChange={setTab} defaultActiveKey="terminal"/>
}
