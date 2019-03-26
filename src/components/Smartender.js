import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

// import SimpleLineChart from './Charts/SimpleLineChart';
import RangeBarChart from './Charts/RangeBarChart';
import DoubleLineChart from './Charts/DoubleLineChart';
// import DoubleBarChart from './Charts/DoubleBarChart';
import SmartenderTable from './SmartenderTable';

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary,
        width: '100%',
        overflowX: 'auto'
    },
    drinkType: {
        paddingLeft: 10
    },
    gridPadding: {
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3
    }
});

class Smartender extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid spacing={24} item xs={12} container>
                <Grid item xs={12} md={4}>
                    <SmartenderTable 
                        colOneHeader={this.props.item.name} 
                        colTwoHeader="Details"
                        data={this.props.item.smartenderTableRows}/>
                </Grid>
                <Grid item xs={12} md={4} className={classes.gridPadding}>
                    <DoubleLineChart 
                        data={this.props.item.weekly_log} 
                        yAxisDataKeyA="drinks"
                        yAxisDataKeyB="revenue" 
                        xAxisDataKey="date"/>
                </Grid>
                <Grid item xs={12} md={4} className={classes.gridPadding}>
                    <RangeBarChart 
                        data={this.props.item.drinks}
                        xAxisDataKey="name"
                        yAxisDataKey="curr_volume"
                        maxRange={this.props.item.drinksMaxVolume} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Smartender);