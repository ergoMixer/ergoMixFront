import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import withLayout from '../../../hoc/with_layout/withLayout';
import MainLayout from '../../../layout/main-layout/MainLayout';
import Panel from '../../../components/panel/Panel';
import { Checkbox, TextField } from '@mui/material';
import { ApiNetwork } from '../../../network/api';
import { useNavigate } from 'react-router-dom';

const NewStealth = () => {
    const [name, setName] = useState('');
    const [needPK, setNeedPK] = useState(false);
    const [pk, setPk] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = () => {
        setLoading(true)
        ApiNetwork.createStealth(name, pk).then((res => {
            setLoading(false);
            navigate('/stealth')
        }))
    }

    return (
        <React.Fragment>
            <div className="col-sm-8 offset-sm-2">
                <Panel>
                    <div className="row">
                        <div className="col-12">
                            Specify a name for this stealth address for future reference.
                            This name is optional and can be edited anytime.
                        </div>
                        <div className="col-12 form-group">
                            <TextField
                                label="Name (optional)"
                                onChange={event => setName(event.target.value)}
                                value={name}
                                required={false}
                            />
                        </div>
                    </div>
                </Panel>
                <Panel>
                    <div className="row">
                        <div className="col-12">
                            Optionally, if you want to import an existing address
                            from other stealth wallet and convert it to a stealth address,
                            input its private key here.
                        </div>
                        <div className="col-12 form-group">
                            <FormControlLabel
                                control={<Checkbox
                                    checked={needPK}
                                    onChange={event => setNeedPK(event.target.checked)}
                                    inputProps={{'aria-label': 'primary checkbox'}}
                                />}
                                label="I want to import an existing private key."
                            />
                        </div>
                        {needPK ? (
                            <div className="col-12 form-group">
                                <TextField
                                    label="Private Key (optional)"
                                    onChange={event => setPk(event.target.value)}
                                    value={pk}
                                    required={false}
                                    disabled={!needPK}
                                />
                                <span className="small">To import address from other wallets</span>
                            </div>
                        ) : null}
                    </div>
                </Panel>
            </div>
            <button className="btn pull-right  btn-success"
                onClick={() => submit()}>
                    Create new stealth address
                &nbsp;&nbsp;
                {loading ? <i className="fa fa-circle-o-notch fa-spin"/> : null}
            </button>
        </React.Fragment>
    )
}


export default withLayout(MainLayout)(NewStealth);
