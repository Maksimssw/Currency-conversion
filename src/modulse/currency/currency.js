import { Component } from "react";
import './currency.scss';
import arrows from '../../modulse/img/arrows.svg';
import country_list from "../../server/flags";

class Currency extends Component{
    constructor(props){
        super(props);
        this.state = {
            list: 2,
            createOption: [],
            amount: 1,
            from: 'USD',
            to: 'NPR',
            totalExchangeRate: '',
            loading: true,
            formImg: 'https://www.countryflagicons.com/FLAT/64/US.png',
            toImg: 'https://www.countryflagicons.com/FLAT/64/NP.png',
            errorText: false
        }
    }

    onChangeFrom = (e) => {

        this.setState(({
            from: e.target.value
        }));

        this.onChangeImg(e.target.value, 'formImg');
    }

     onChangeImg = async (elem, item) =>{
        this.setState(({loading: false}))
        for (let code in country_list){
             if(code === elem){
                let toImg = await `https://www.countryflagicons.com/FLAT/64/${country_list[code]}.png`;
                if(item === 'formImg'){
                    this.setState(({
                        formImg: toImg,
                        loading: true
                    }))
                }else if(item === 'toImg'){
                    this.setState(({
                        toImg,
                        loading: true
                    }))
                }
            }
        }
    }


    componentDidMount(){
        this.createOption();
        this.onGetExchange();
    }

    createOption = () => {
        for(let key in country_list){
            this.setState(({createOption}) => ({
                createOption: [...createOption, key]
            }))
        }
    }

    onGetRate = (e) =>{
        e.preventDefault();
    }

    onAmount = (e) => {
        this.setState(({
            amount: e.target.value,
            loading: true,
        }))
    }

    onArrows = () => {
        let tempCode = this.state.from;
        this.setState(({
            from: this.state.to,
            to: tempCode,
            loading: true
        }));
        
        this.onChangeImg(this.state.to, 'formImg');
        this.onChangeImg(this.state.from, 'toImg');
    }

    onGetExchange = () => {
        if(this.state.amount === '' || this.state.amount === '0'){
            this.setState(({
                amount: 1
            }))
        }

        this.setState(({loading: true}))

        let url = `https://v6.exchangerate-api.com/v6/${this.props.apiKey}/latest/${this.state.from}`;
        fetch(url)
            .then(res => res.json())
            .then(res => {
                let exchangeRate = res.conversion_rates[this.state.to];
                let totalExchangeRate = (this.state.amount * exchangeRate).toFixed(2);
                this.setState(({
                    totalExchangeRate: totalExchangeRate,
                    loading: false,
                    errorText: false
                }))
            })
            .catch(() => {
                this.setState(({errorText: true}))
            })
    }

    onChangeTo = (e) => {
        this.setState(({to: e.target.value}))

        this.onChangeImg(e.target.value, 'toImg');
    }

    render(){
        const {createOption, amount, from, to, totalExchangeRate, loading, formImg, toImg, errorText} = this.state;

        const createFrom = () =>{

            const createFrom = createOption.map((item, i) => {

                return(
                    <option value={item} key={item + i} selected={item === `${from}` ? 'selected' : null}>{item}</option>
                )
            });

            return createFrom;
        }

        const createTo = () =>{
            const createFrom = createOption.map((item, i) => {

                    return(
                        <option value={item} key={item + i} selected={item === `${to}` ? 'selected' : null}>{item}</option>
                    )
                });

            return createFrom;
        }

        return(
            <div className="currency_wrapper">
                <h1 className="currency_wrapper_title">Currency Converter</h1>
                <h2 className="currency_wrapper_subtitle">Enter Amount</h2>
                <form action="#"
                       onSubmit={this.onGetRate}>
                    <input placeholder="1" type='text' value={amount} onChange={this.onAmount}/>
                    <div className="converter">
                        <div className="converter_form">
                            <h3>From</h3>
                            <div className="converter_form_curs">
                                <img src={formImg} alt="flag"/>
                                <select onChange={this.onChangeFrom}>
                                    {createFrom()}
                                </select>
                            </div>
                        </div>
                        <img src={arrows} alt="arrows" className="arrows" onClick={this.onArrows}/>
                        <div className="converter_form">
                            <h3>To</h3>
                            <div className="converter_form_curs">
                                <img src={toImg} alt="flag"/>
                                <select onChange={this.onChangeTo}>
                                    {createTo()}
                                </select>
                            </div>
                        </div>
                    </div>
                    <h3 className="translation">{errorText ? 'An error has occurred, choose another strange' : loading ? 'Getting exchange rate...' : `${amount} ${from}  =  ${totalExchangeRate} ${to}`}</h3>
                    <button onClick={this.onGetExchange}>Get Exchange Rate</button>
                </form>
            </div>
        )
    }
}

export default Currency;