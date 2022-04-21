import React from 'react';
import withLayout from "../../hoc/with_layout/withLayout";
import MainLayout from '../../layout/main-layout/MainLayout';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CopyClipboard from "../../components/copy-clipboard/CopyClipboard";

const HOME_BOXES = [
    {
        title: 'Fees', content: (
            <div>
                There are two kinds of fee in ErgoMixer:
                <ul>
                    <li>
                        <b>Miner fee:</b>&nbsp;
                        This fee is determined with the mixing level and the number of output boxes,
                        the higher the mixing level and output boxes, the higher the fee.
                        The formula is &nbsp;
                        <span className="code"><i>2</i> x <i>number_of_boxes</i> x <i>mixing_level</i> x <i>max_transaction_fee</i></span>.
                        <br/>
                        The max_transaction_fee is currently set to 0.002 ERG and
                        the 2 factor is because the mixer itself
                        has to move around many boxes to make the mixing possible.
                    </li>
                    <li>
                        <b>Entry fee:</b>&nbsp;
                        This fee is independent of the mixing level and how you distribute your assets in boxes.
                        It is calculated as a small percentage of what you are mixing. Currently,
                        this percentage is 0.5%. So if you are mixing 110 ERG this fee will be 0.55 ERG.
                    </li>
                </ul>
            </div>
        )
    },
    {
        title: 'How to change the configuration file', content: (
            <div>
                If you are running ErgoMixer using docker or jar file, you can follow the instruction on github page on how to provide custom config file for the mixer.
                If you are using binaries, you can use the tray icon menu and select "Open configuration file". When the file is open, you can edit it as you want and save it.
                After saving the file, you need to restart ErgoMixer for the changes to take effect.
            </div>
        )
    },
    {
        title: 'Covert address', content: (
            <div>
                A covert address is a permanent starting point for mixing that simultaneously supports mixing ERG
                and any other tokens. You can post the address on your website or
                anywhere else to get payments, donations, etc. covert address's
                income will automatically enter mixing with your predefined
                settings and will be withdrawn to your desired addresses.
                <br/>
                When you create a covert address, it only supports mixing ERG in 250 ERG ring.
                In the asset page of the covert address, you can modify the ring in which you want
                your assets to enter mixing. Also, you can see all different tokens deposited to your covert address
                and add support for mixing them.
                <br/>
                So, create a covert address, configure it just once, and keep the mixer running.
                All your funds will go through the mixer automatically and will be withdrawn to your desired addresses.
            </div>
        )
    },
    {
        title: 'Import an existing address from other wallets',
        content: (
            <div>
                Optionally, to import an existing address from other
                wallets and convert it to a covert address,
                input its private key at the &nbsp;
                <b>NAME / IMPORT KEYS</b> &nbsp;
                step when creating a new covert address.
            </div>
        )
    },
    {
        title: 'Mixing duration', content: (
            <div>
                The duration of a mix depends on the network’s traffic,
                rings in which you are mixing, and the level of mixing that you have selected.
                If you are satisfied with the number of mixing rounds that your boxes have gone through,
                you can withdraw them whenever and however you want without needing to wait for completion.
            </div>
        )
    },
    {
        title: 'Purchasing SigmaUSD and SigmaRSV', content: (
            <div>
                You can use your mixing boxes to purchase SigmaUSD/SigmaRSV directly in the mixer.
                Easily, use mixing boxes that are completed, set their withdrawal address,
                and purchase the AgeUSD token you like. SigmaUSD/SigmaRSV tokens will be purchased directly from
                the deployed AgeUSD contracts and will be sent to the withdrawal address.
            </div>
        )
    },
    {
        title: 'Hops', content: (
            <div>
                Using Hop feature you can withdraw your boxes through some P2PK addresses as 'hops',
                obfuscating the fact that a box is mixed.
                Note that any withdrawn box will pay for its mining fee as it hops.
                <br/>
                This feature is disabled by default;
                To enable it, change <b>hopRounds</b> to any desired number of hops in the configuration file.
                Changing this value will immediately affect all mix and covert withdrawals.
            </div>
        )
    },
    {
        title: 'Communication through the Internet', content: (
            <div>
                ErgoMixer connects to the Internet in order to communicate
                with the explorer and nodes which are configurable in the configuration file.
                There is no other communication to anywhere else.
                <br/>
                You can also configure ErgoMixer to use Tor.
            </div>
        )
    },
    {
        title: 'Nodes and explorer', content: (
            <div>
                ErgoMixer uses the official ERGO explorer.
                <br/>
                Also, ErgoMixer uses a list of nodes
                (for each interaction, one will be randomly selected for security reasons)
                that are pre-defined in your configuration file. you may add/change the list of nodes as you wish.
            </div>
        )
    },
    {
        title: 'Tor', content: (
            <div>
                If you wish your mixing traffic to go through Tor for security reasons,
                then you can configure ErgoMixer to use Tor in the configuration file by specifying url and port.
            </div>
        )
    },
    {
        title: 'Sensitive data and backup', content: (
            <div>
                All data about your mixes, secrets, etc. are saved locally on your PC in a database,
                protected by the password that you set in the configuration file. If you'd like to change database's password,
                then make sure you have no data in your current database, then remove it and set the password you wish in the configuration file.
                The database and the log files are saved in your home directory in a folder called ergoMixer.
                You can backup these data in case of any future disaster using backup/restore in the UI.
                <br/>
                Also, you can view and download the private keys of your covert addresses using the <b>Show PrivateKey</b> option.
                <br/>
                <br/>
                <strong>We highly recommend you to use backup only for the sake of having covert addresses' secrets in case of future disasters.
                    <br/>
                    If you wish to use backup for other mixes as well, you should note that if you use backup when you have some running mixes, then
                    the backup will not contain future information about upcoming mix rounds.
                    <br/>
                    If you want to move your mixes to some other machine, then use backup, stop the mixer afterwards and restore it on the machine you want.
                <br/>
                Also, make sure to avoid running two instances of ErgoMixer with the same database/backup.</strong>
            </div>
        )
    },
    {
        title: 'Backward compatibility', content: (
            <div>
                ErgoMixer will be backward compatible starting from version 3.0.0.
                Meaning that if you wish to update your ErgoMixer, you won't need to finish your mixes
                and remove your database to start using a new version in the future.
                <br/>
                This backward compatibility feature may be violated in some rare cases in the future.
            </div>
        )
    },
    {
        title: 'Dynamic fee scheme', content: (
            <div>
                ErgoMixer uses a dynamic fee scheme to calculate fees for each of the mixing transactions
                depending on the transaction's size. So, each mixing transaction will have a constant fee
                per byte value and will be mined uniformly by miners.
                <br/>
                This constant is currently set at 0.000001 ERG per byte.
                This value is configurable on the blockchain by mixer's developers without needing users
                to update their ErgoMixer. This value will be increased as the mempool gets
                bigger and there is more competition for transactions to be mined.
            </div>
        )
    },
    {
        title: 'Data pruning and performance', content: (
            <div>
                Over time, as your mixing data gets bigger, the ErgoMixer performance may decrease.
                To prevent this, the pruning feature is added to the ErgoMixer.
                <br/>
                If you enable pruning, your mixes that have been withdrawn
                and confirmed with a configurable number of blocks will be permanently deleted from the database.
                <br/>
                Pruning feature is disabled by default; To enable it, change <i>prune</i> to <i>true</i> and <i>pruneAfter </i>
                to your desired number of confirmations in the configuration file.
                <br/>
                <br/>
                As an example, if you enable pruning by setting <i>pruneAfter</i> to 720,
                then when a mix is withdrawn and confirmed by 720 blocks (roughly 1 day)
                then the history of the mix will be deleted from the database.
            </div>
        )
    },
    {
        title: 'Donation', content: (
            <div>We are a group of anonymous developers interested in ERGO and basic privacy rights.
                We are constantly trying to improve the mixer and your mixing experience by adding new features to the ErgoMixer.
                If you'd like to support the development, please send your donations to this covert address: &nbsp;
                <b><CopyClipboard value="9g1p6UU8XoAeU4yGPLpbTHYiG8aBHwfCFzQqJZrfzuLnmF3zb7P"/></b>
            </div>
        )
    },
]

class Home extends React.Component {
    state = {
        active: 6,
    }
    handleChange = (index) => {
        this.setState({active: index});
    };

    render = () => {

        return (
            <div className={this.props.root}>
                {HOME_BOXES.map((item, index)=> (
                    <Accordion expanded={this.state.active === index} onChange={() => this.handleChange(index)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={this.props.heading}><h4>{item.title}</h4></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography><div style={{textAlign: 'justify'}}>{item.content}</div></Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        );
    };
}
export default withLayout(MainLayout)(Home);
