import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Topbar from './Appbar/Topbar';
import Smartender from './Smartender';
import QuickCard from './QuickCard';
import CustomPieChart from './Charts/CustomPieChart';
import SimpleSnackbar from './SimpleSnackbar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        backgroundSize: 'cover',
        backgroundPosition: '0 400px',
        overflow: 'hidden',
        paddingBottom: 200
    },
    grid: {
        width: 1200,
        margin: `0 ${theme.spacing.unit * 2}px`,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    block: {
        padding: theme.spacing.unit * 2,
    },
    outlinedButton: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    drinkType: {
        paddingLeft: 10
    }
});

const herokuHTTPS = "https://cors-anywhere.herokuapp.com/";
const hostname =  herokuHTTPS + "http://ec2-13-58-113-143.us-east-2.compute.amazonaws.com/machines";
const barcoinAPIOperator = herokuHTTPS + "http://ec2-18-219-145-4.us-east-2.compute.amazonaws.com:3002/operator/";
const barcoinAPIBalanceEndpoint = "/balance";
const barcoinAPIWalletEndpoint = "/smartenderAccountWallet";
const BAR_ID = 0; // hardcoded bar ID used to index wallet address -- can be passed in as env variable for scalability

// used to index table rows
var id = 0;

class Main extends Component {

    state = {
        smartenders: [],
        lifetimeDrinks: 0,
        lifetimeEarnings: 'N/A',
        currentDrinks: 0,
        currentEarnings: 'N/A',
        totalSmartenders: 0,
        bestSmartender: 0,
        openSnackbar: false,
        blockchainWallet: "b30e5d728f79e253f00268d27cddced6230a0f01cd5e705fb8cb8f1fe0d18176",
        barcoinBalance: 0
    }

    componentDidMount() {
        this.getSmartenderData();
        this.getWalletAddress();
        this.getBarcoinBalance();
    }

    /**
     * Click listener for load data button.
     */
    onClickLoadData = (event) => {
        event.preventDefault();
        this.getSmartenderData();
        this.getWalletAddress();
        this.getBarcoinBalance();
        this.setState({ openSnackbar: true });
    }

    /**
     * Gets smartender data from server and modifies it for the web app.
     */
    getSmartenderData = async () => {    
        await fetch(`${hostname}`)
        .then(response => response.json())
        .then(contents => {
            // console.log(contents);
            this.setStateSmartender(contents);
        })
        .catch((e) => console.log(e));
    }

    /**
     * Calls the barcoin api and gets the wallet address for the current bar.
     * Current bar specified by BAR_ID.
     */
    getWalletAddress = async () => {

        var apiURL = barcoinAPIOperator + barcoinAPIWalletEndpoint;

        await fetch(`${apiURL}`)
        .then(response => response.json())
        .then(contents => {
            this.setWalletAddress(contents);
        })
        .catch((e) => console.log(e));

    }

    /**
     * Sets the state for the blockchainWallet.
     */
    setWalletAddress = (data) => {
        if(data !== undefined) {
            this.setState({
                blockchainWallet: data.addresses[BAR_ID]
            })
        }
    }

    /**
     * Calls Barcoin API and gets barcoin 
     * balance for the wallet address
     * requested from getWalletAddress.
     */
    getBarcoinBalance = async () => {

        var apiURL = barcoinAPIOperator + this.state.blockchainWallet + barcoinAPIBalanceEndpoint;

        await fetch(`${apiURL}`)
        .then(response => response.json())
        .then(contents => {
            this.setBarcoinBalance(contents);
        })
        .catch((e) => console.log(e));
    }

    /**
     * Sets state for barcoin balance
     */
    setBarcoinBalance = (data) => {
        if(data !== undefined) {
            this.setState({ 
                barcoinBalance: data.balance 
            });
        }
    }

    /**
     * Returns the sum of all time drinks and all time revenues.
     */
    sumWeeklyLog = (data) => {
        var i;
        var sum = {
            drinkSum: 0,
            revenueSum: 0
        };
        for(i = 0; i < data.length; i++) {
            sum.drinkSum += data[i].drinks;
            sum.revenueSum += data[i].revenue;
        }

        return sum;
    }

    /**
     * Reformats smartender data from server to be used for web app.
     */
    setStateSmartender = (data) => {

        // variables used for refactoring smartender data
        // refectored data used for double bar chart
        var smartenderData = data;
        var smartendersArr = [];

        // variables used for QuickCard components
        var lifetimeDrinks = 0;
        var currentDrinks = 0;
        var totalSmartenders = 0;
        var bestSmartender = 0;
        var bestWeeklyLogSum = 0;
        var lifetimeEarnings = 0;
        var currentEarnings = 0;

        var j;
        for( j = 0; j < smartenderData.length; j++) {

            // Get each smartender obj
            var smartenderObj = smartenderData[j];

            // record drinks max volume for each obj
            var drinksMaxVolume = 0;

            // If obj isn't undefined do some calculations and refactoring
            if(smartenderObj !== undefined) {
                var inventoryArr = smartenderObj.inventory;

                /* Calculations for Quick Cards */
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                var drinksArr = smartenderObj.drinks;
                var weeklyLog = smartenderObj.weekly_log;
                var drinksThisWeek = smartenderObj.drinks_this_week;
                var revenueThisWeek = smartenderObj.revenue_this_week;

                var weeklyLogSum = this.sumWeeklyLog(weeklyLog);

                if(weeklyLogSum.revenueSum > bestWeeklyLogSum) {
                    bestWeeklyLogSum = weeklyLogSum.revenueSum;
                    bestSmartender = j; // change this to smartender id?
                }

                lifetimeDrinks += weeklyLogSum.drinkSum + drinksThisWeek;
                lifetimeEarnings += weeklyLogSum.revenueSum + revenueThisWeek;
                currentDrinks += drinksThisWeek;
                currentEarnings += revenueThisWeek;
                totalSmartenders += 1;
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                /* End of calculations for Quick Cards */
    
                /* Refactor smartender array */
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                var drinksInv = [];
                if(inventoryArr.length !== 0 && drinksArr !== 0) {
                    var i;
                    for( i = 0; i < drinksArr.length; i++ ) {
                        var drinkObj = drinksArr[i];
                        drinkObj.curr_volume = inventoryArr[i];
                        drinksMaxVolume = drinkObj.max_volume;
                        drinksInv.push(drinkObj);
                    }
                    smartenderObj.drinks = drinksInv;
                }

                // create data for smartender table
                var smartenderTableRows = [
                    this.createData('Drinks this Week', drinksThisWeek),
                    this.createData('Revenue this Week', `$` + revenueThisWeek.toFixed(2)),
                    this.createData('Lifetime Drinks', weeklyLogSum.drinkSum + drinksThisWeek),
                    this.createData('Lifetime Revenue', `$` + (weeklyLogSum.revenueSum + revenueThisWeek).toFixed(2))
                ];
                smartenderObj.smartenderTableRows = smartenderTableRows;
                smartenderObj.drinksMaxVolume = drinksMaxVolume;
                smartendersArr.push(smartenderObj);
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                /* End of refactoring for smartender array */
            }

        }

        this.setState({
            smartenders: smartendersArr,
            lifetimeDrinks: lifetimeDrinks,
            currentDrinks: currentDrinks,
            totalSmartenders: totalSmartenders,
            bestSmartender: bestSmartender,
            currentEarnings: `$` + currentEarnings.toFixed(2),
            lifetimeEarnings: `$` + lifetimeEarnings.toFixed(2)
        });
        
    }

    createData = (name, details) => {
        id += 1;
        return { id, name, details };
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        this.setState({ openSnackbar: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <Topbar />
                <SimpleSnackbar 
                    openSnackbar={this.state.openSnackbar} 
                    handleClose={this.handleSnackbarClose}
                    duration={3000}
                    variant="success"
                    message="Data Updated" />
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid item xs={12}>
                                <div className={classes.topBar}>
                                    <div className={classes.block}>
                                        <Typography variant="h6" gutterBottom>Dashboard</Typography>
                                        <Typography variant="body1">
                                            A visual dashboard for Smartender data.
                                        </Typography>
                                    </div>
                                    <div>
                                        <Button variant="outlined" className={classes.outlinedButton} 
                                            onClick={this.onClickLoadData}
                                        >
                                            Load Data
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                            <Grid spacing={24} item xs={12} container>
                                <QuickCard dataVal={this.state.lifetimeDrinks} dataKey="Lifetime Drinks"/>
                                <QuickCard dataVal={this.state.lifetimeEarnings} dataKey="Lifetime Earnings"/>
                                <QuickCard dataVal={this.state.currentDrinks} dataKey="Current Drinks"/>
                                <QuickCard dataVal={this.state.currentEarnings} dataKey="Current Earnings"/>
                                <QuickCard dataVal={this.state.totalSmartenders} dataKey="Total Smartenders"/>
                                <QuickCard dataVal={this.state.barcoinBalance} dataKey="Total Barcoins"/>
                            </Grid>
                            <Grid spacing={24} item xs={12} container>
                                <Grid item xs={12} md={6}>
                                    <CustomPieChart 
                                        data={this.state.smartenders}
                                        dataKey="drinks_this_week" 
                                        dataTitle="Drinks this Week" />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CustomPieChart 
                                        data={this.state.smartenders}
                                        dataKey="revenue_this_week"
                                        dataTitle="Revenue this Week" />
                                </Grid>
                            </Grid>
                            {this.state.smartenders.map((item, index) => (
                                <Smartender item={item} key={index} />
                            ))}
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Main));